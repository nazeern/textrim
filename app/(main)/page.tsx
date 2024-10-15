import MainEditor, { VideoData } from "@/app/MainEditor";
import { sampleVideoData } from "../lib/data";
import { getVideoUrl, queryVideoData } from "../lib/videos";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return <p>Ya aint logged in boi</p>;
  }
  // const loadedVideoData = sampleVideoData;
  const loadedVideoData = await queryVideoData(user.id);
  if (!loadedVideoData) {
    return <p>Ain't loaded boy</p>;
  }
  loadedVideoData.forEach(async (videoData) => {
    videoData.sourceUrl = await getVideoUrl(videoData.filename);
  });
  // After querying loadedVideoData, fill information as needed.
  return <MainEditor loadedVideoData={loadedVideoData} userId={user.id} />;
}
