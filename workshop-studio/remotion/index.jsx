import { Composition } from "remotion";
import { registerRoot } from "remotion";
import { WorkshopVideo } from "./WorkshopVideo";

export const RemotionRoot = () => (
  <Composition
    id="WorkshopPromo"
    component={WorkshopVideo}
    durationInFrames={240}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{
      workshop: {
        title: "AVIZ Workshop",
        date: "",
        time: "20:00",
        price: "₪100",
        status: "workshop",
        slug: "workshop"
      },
      brandDataUri: ""
    }}
  />
);

registerRoot(RemotionRoot);
