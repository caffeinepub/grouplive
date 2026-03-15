import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, GroupStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useGetGroups() {
  const { actor, isFetching } = useActor();
  return useQuery<GroupStatus[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGroups();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetMessages(groupName: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["messages", groupName],
    queryFn: async () => {
      if (!actor || !groupName) return [];
      return actor.getMessages(groupName);
    },
    enabled: !!actor && !isFetching && !!groupName,
    refetchInterval: 3000,
  });
}

export function useVerifyPasscode() {
  const { actor } = useActor();
  return useMutation<boolean, Error, string>({
    mutationFn: async (pass: string) => {
      if (!actor) throw new Error("No actor");
      return actor.verifyPasscode(pass);
    },
  });
}

export function useGoLive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (groupName: string) => {
      if (!actor) throw new Error("No actor");
      return actor.goLive(groupName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useEndLive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (groupName: string) => {
      if (!actor) throw new Error("No actor");
      return actor.endLive(groupName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { groupName: string; senderName: string; message: string }
  >({
    mutationFn: async ({ groupName, senderName, message }) => {
      if (!actor) throw new Error("No actor");
      return actor.sendMessage(groupName, senderName, message);
    },
    onSuccess: (_, { groupName }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", groupName] });
    },
  });
}
