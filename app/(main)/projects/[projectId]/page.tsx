import MainEditor from "@/app/MainEditor";
import { getCurrentPlan, queryUsage } from "@/app/lib/profiles";
import { decodeBase64UUID } from "@/app/lib/string";
import { getVideoUrl, queryVideoData } from "@/app/lib/videos";
import { Plan } from "@/app/ui/plan-card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Editor({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const projectId = decodeBase64UUID((await params).projectId);
  const [loadedVideoData, { plan }, usageData] = await Promise.all([
    queryVideoData(projectId),
    getCurrentPlan(user.id),
    queryUsage(user.id),
  ]);

  const includedMinutes = Plan.includedMinutes(plan);
  const minutesUsed = usageData?.totalMinutesTranscribed ?? 50;
  const loadedMinutesRemaining = includedMinutes - minutesUsed;

  if (!loadedVideoData) {
    return <p>Aint loaded boy</p>;
  }
  loadedVideoData.forEach(async (videoData) => {
    videoData.sourceUrl = await getVideoUrl(videoData.filename);
  });
  // After querying loadedVideoData, fill information as needed.
  return (
    <MainEditor
      loadedVideoData={loadedVideoData}
      projectId={projectId}
      userId={user.id}
      plan={plan}
      loadedMinutesRemaining={loadedMinutesRemaining}
    />
  );
}
