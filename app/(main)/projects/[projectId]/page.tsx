import MainEditor from "@/app/MainEditor";
import { getCurrentPlan } from "@/app/lib/profiles";
import { decodeBase64UUID } from "@/app/lib/string";
import { getVideoUrl, queryVideoData } from "@/app/lib/videos";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Editor({
  params,
}: {
  params: { projectId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const projectId = decodeBase64UUID(params.projectId);
  const loadedVideoData = await queryVideoData(projectId);
  const plan = await getCurrentPlan(user.id);
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
    />
  );
}
