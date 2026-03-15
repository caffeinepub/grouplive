import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let passcode = "8945";

  type Group = {
    name : Text;
    var isLive : Bool;
  };

  type ChatMessage = {
    sender : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public type GroupStatus = {
    name : Text;
    isLive : Bool;
  };

  module GroupStatus {
    public func compare(g1 : GroupStatus, g2 : GroupStatus) : Order.Order {
      Text.compare(g1.name, g2.name);
    };
  };

  var groupsList = List.empty<Group>();
  let messages = Map.empty<Text, List.List<ChatMessage>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper functions
  func initializeGroups() {
    ["The Stars", "Fire Squad", "Neon Vibes", "Bass Drop"].forEach(
      func(name) {
        let group : Group = { name; var isLive = false };
        groupsList.add(group);
        messages.add(name, List.empty<ChatMessage>());
      }
    );
  };

  // Initialize groups on deployment
  initializeGroups();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Passcode verification - available to all (including guests)
  public query ({ caller }) func verifyPasscode(pass : Text) : async Bool {
    pass == passcode;
  };

  // Live status management - requires user authentication
  public shared ({ caller }) func goLive(groupName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start live streams");
    };

    var found = false;
    groupsList.forEach(func(group) { 
      if (group.name == groupName) { 
        group.isLive := true;
        found := true;
      };
    });

    if (not found) {
      Runtime.trap("Group does not exist");
    };
  };

  public shared ({ caller }) func endLive(groupName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can end live streams");
    };

    var found = false;
    groupsList.forEach(func(group) { 
      if (group.name == groupName) { 
        group.isLive := false;
        found := true;
      };
    });

    if (not found) {
      Runtime.trap("Group does not exist");
    };
  };

  // Get groups - available to all (including guests)
  public query ({ caller }) func getGroups() : async [GroupStatus] {
    groupsList.toArray().map(
      func(group) {
        {
          name = group.name;
          isLive = group.isLive;
        };
      }
    );
  };

  // Chat functionality - sending requires user authentication
  public shared ({ caller }) func sendMessage(groupName : Text, senderName : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let timestamp = Time.now();
    let newMessage : ChatMessage = {
      sender = senderName;
      message;
      timestamp;
    };

    let groupMessages = switch (messages.get(groupName)) {
      case (null) { Runtime.trap("Group does not exist") };
      case (?msgList) {
        if (msgList.size() >= 100) {
          ignore msgList.removeLast();
        };
        msgList.add(newMessage);
        msgList;
      };
    };
    messages.add(groupName, groupMessages);
  };

  // Get messages - available to all (including guests)
  public query ({ caller }) func getMessages(groupName : Text) : async [ChatMessage] {
    switch (messages.get(groupName)) {
      case (null) { Runtime.trap("Group does not exist") };
      case (?msgList) {
        msgList.toArray();
      };
    };
  };
};
