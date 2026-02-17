

import { getCurrentUser }
  from "@/lib/current-user";
import SettingsLayout from "../../../components/settings/setting-layout";

export default async function Page() {

  const user =
    await getCurrentUser();

  return (
    <SettingsLayout user={user} />
  );

}

