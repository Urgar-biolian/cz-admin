import { defHttp } from "@/utils/http/axios";

import { ErrorMessageMode } from "#/axios";
import {
  InvitationItem,
  InvitationListResult,
  InvitationParams,
} from "./model/invitationModel";

enum Api {
  GenerateInvitation = "/generate-invitation",
  GetInvitations = "/invitations",
  DeleteInvitation = "/invitation",
}

export function generateInvitationApi(
  params: InvitationParams,
  mode: ErrorMessageMode = "modal",
) {
  return defHttp.post<InvitationItem>(
    {
      url: Api.GenerateInvitation,
      data: {
        ...params,
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function getInvitationApi(mode: ErrorMessageMode = "modal") {
  return defHttp.get<InvitationListResult>(
    {
      url: Api.GetInvitations,
    },
    {
      errorMessageMode: mode,
    },
  );
}

export function deleteInvitationApi(id: number) {
  return defHttp.delete<{ success: boolean }>(
    {
      url: Api.DeleteInvitation + `/${id}`,
    },
    {
      errorMessageMode: "none",
    },
  );
}
