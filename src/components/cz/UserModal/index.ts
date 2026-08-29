import { createApp } from "vue";
import UserModal from "./index.vue";
import { useShowingUserModal } from "@/store/modules/userModal";
import type { GetUserInfoModel } from "@/api/sys/model/userModel";

export default function showUserModal(userInfo: Partial<GetUserInfoModel>) { //Ugar-biolian
  const { state } = useShowingUserModal();

  if (!state.hasInstance) {
    const app = createApp(UserModal);
    const div = document.createElement("div");
    document.body.appendChild(div);
    app.mount(div);
    state.hasInstance = true;
  }
  state.showUserInfo = userInfo;
  state.isShowingUserModal = true;
}
