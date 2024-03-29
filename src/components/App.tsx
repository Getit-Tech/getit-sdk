import { useState, useEffect } from "react";
import axios from "axios";

interface IProps {
  apiKey: string;
  walletConnected: string;
  isMobile?: boolean;
  slotId: string;
  height?: number;
}

interface IGetAd {
  redirect_link: string;
  image_url: string;
  campaign_uuid: string;
  campaign_name: string;
  banner_uuid: string;
  banner_name: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

enum EImageTypes {
  DESK = "DESKTOP",
  MOB = "MOBILE",
}

enum EImageSize {
  DESK = "728",
  MOB = "270",
}

const encryptApi = (str: string, key: number): string => {
  let encrypted = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const encryptedCharCode = Math.floor((charCode + key) % 256);
    encrypted += String.fromCharCode(encryptedCharCode);
  }
  return encrypted;
};

const getImage = async (params: IProps, isMobile: boolean): Promise<IGetAd | void> => {
  const ts: string = Date.now().toString();
  const api_key: string = encryptApi(params.apiKey, 26);

  let walletMetamask = [];
  if (window.ethereum) {
    walletMetamask = await window.ethereum.request({
      method: "eth_accounts",
    });
  }

  const data = await axios.post("https://v1.getittech.io/v1/ads/get_ad", {
    wallet_address: params.walletConnected ? params.walletConnected : walletMetamask[0] ? walletMetamask[0] : "",
    timestamp: ts,
    api_key,
    image_type: isMobile ? EImageTypes.MOB : EImageTypes.DESK,
    page_name: window.location.pathname,
    slot_id: params.slotId,
  });
  return data.data as IGetAd;
};

const generateUrl = async (params: IProps, campaign_uuid: string, banner_uuid: string) => {
  const ts: string = Date.now().toString();
  const api_key: string = encryptApi(params.apiKey, 26);

  let walletMetamask = [];
  if (window.ethereum) {
    walletMetamask = await window.ethereum.request({
      method: "eth_accounts",
    });
  }

  await axios.post("https://v1.getittech.io/v1/utm/event", {
    api_key,
    timestamp: ts,
    campaign_uuid,
    wallet_address: params.walletConnected ? params.walletConnected : walletMetamask[0] ? walletMetamask[0] : "",
    event_type: "CLICK",
    page_name: window.location.pathname,
    slot_id: params.slotId,
    banner_uuid: banner_uuid ? banner_uuid : "0000-0000-0000-0000",
  });
};

const OS = {
  win: "Win64",
  iPhone: "iPhone",
  android: "Android",
};

const getUserDevice = () => {
  const ua = navigator.userAgent;

  if (ua.toLowerCase().includes(OS.iPhone.toLowerCase()) || ua.toLowerCase().includes(OS.android.toLowerCase())) {
    console.log(OS.iPhone);
    return true;
  }

  return false;
};

const getCountry = async () => {
  const locationData = await axios.get("https://ipapi.co/json/");
  const countryIso2 = locationData.data.country;
  return countryIso2;
};

const GetitAdPlugin = (props: IProps) => {
  const [useImageUrl, setImageUrl] = useState<string>("");
  const [useRedirect, setRedirect] = useState<string>("");
  const [useCampaign, setCampaign] = useState<string>("");
  const [useCampaignName, setCampaignName] = useState<string>("");
  const [bannerUUID, setBannerUUID] = useState("0000-0000-0000-0000");
  const [bannerName, setBannerName] = useState("");
  const [height, setHeight] = useState("0");

  useEffect(() => {
    const init = async (): Promise<void> => {
      const isMobile = props.isMobile ? props.isMobile : getUserDevice();
      const data: IGetAd | void = await getImage(props, isMobile);
      if (!data) {
        return;
      }
      setHeight("90");
      setImageUrl(data.image_url);
      setRedirect(data.redirect_link);
      setCampaign(data.campaign_uuid);
      setCampaignName(data.campaign_name);
      setBannerUUID(data.banner_uuid);
      setBannerName(data.banner_name);
      getCountry();
    };

    init();
  }, [props.walletConnected]);

  return (
    <div
      style={{
        justifyContent: "center",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        height: height + "px",
        width: `${props.isMobile ? EImageSize.MOB + "px" : EImageSize.DESK + "px"}`,
      }}
    >
      <div
        style={{
          margin: 0,
          backgroundColor: "black",
          alignSelf: "center",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "10px",
        }}
      >
        <a
          style={{ cursor: "pointer" }}
          href={
            useRedirect +
            "?utm_campaign=" +
            useCampaignName +
            "&" +
            "utm_content=" +
            bannerName +
            "&" +
            "utm_source=" +
            "getit"
          }
          target='_blank'
          rel='noreferrer'
          onClick={async () => await generateUrl(props, useCampaign, bannerUUID)}
        >
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              verticalAlign: "middle",
              borderRadius: "10px",
              overflowClipMargin: "content-box",
              overflow: "clip",
            }}
            src={useImageUrl}
          />
        </a>
      </div>
    </div>
  );
};

export default GetitAdPlugin;
