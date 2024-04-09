import React from "react";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Unauthorized from "@/components/unauthorized";
import SideBar from "@/components/sidebar";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/info-bar";
// import Unauthorized from "../unauthorized/page"

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }
  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

    let allNoti: any =[]
    const notification = await getNotificationAndUser(agencyId)
    if(notification) allNoti = notification;

    return(
      <div className="h-screen overflow-hidden">
      <SideBar 
          id={params.agencyId}
          type="agency"
          />
          <div className="md:pl-[300px]">
            <InfoBar 
                notifications={allNoti}
                role={allNoti.User?.role}
                />
             <div className="relative">
               <BlurPage>{children}</BlurPage>
             </div>
          </div>
      </div>
    )
};

export default layout;
