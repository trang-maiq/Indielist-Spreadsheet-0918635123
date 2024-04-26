import React, { useEffect, useState } from "react";
import LandingLayout from "@/components/landingPage/landingLayout";
import SEO from "@/components/additional/seo";
import LandingHeader from "@/components/landingPage/landingHeader";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import { useSession } from "next-auth/react";
import PrivateData from "@/components/dashboard/PrivateData";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);

  let router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/db/user-subscription/get-current-user-sub-status`
      );
      if (response.ok) {
        setIsLoading(false);
        const data = await response.json();
        setUserSubscription(data);
      } else {
        setIsLoading(false);
        console.error("Failed to fetch user subscription");
      }
    };
    if (status === "authenticated") {
      setIsAuthenticated(true);
      fetchUserName();
    }
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);
  return (
    <>
      <LandingLayout>
        <LandingHeader />
        <DashboardContainer>
          {!isLoading && status === "authenticated" ? (
            <>
              <SEO />
              <main className="flex">
                <PrivateData userSubscription={userSubscription} />
              </main>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center h-screen">
                <p>Loading</p>
              </div>
            </>
          )}
        </DashboardContainer>
      </LandingLayout>
    </>
  );
}
