import { useState, useEffect } from "react";
import axios from "axios";

interface IProps {
  apiKey: string;
  walletConnected: string;
  isMobile: boolean;
  slotId: string;
}

interface IGetAd {
  redirect_link: string;
  image_url: string;
  campaign_uuid: string;
  campaign_name: string;
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

const getImage = async (params: IProps): Promise<IGetAd | void> => {
  const ts: string = Date.now().toString();
  const api_key: string = encryptApi(params.apiKey, 26);

  const data = await axios.post("https://v1.getittech.io/v1/ads/get_ad", {
    wallet_address: params.walletConnected,
    timestamp: ts,
    api_key,
    image_type: params.isMobile ? EImageTypes.MOB : EImageTypes.DESK,
    page_name: window.location.host + window.location.pathname,
    slot_id: params.slotId,
  });
  return data.data as IGetAd;
};

const generateUrl = async (params: IProps, campaign_uuid: string, campaign_name: string, redirect: string) => {
  const curUrl: string = window.location.href;
  const ts: string = Date.now().toString();
  const api_key: string = encryptApi(params.apiKey, 26);
  await axios.post("https://v1.getittech.io/v1/utm/event", {
    api_key,
    timestamp: ts,
    campaign_uuid,
    event_type: "CLICK",
    page_name: window.location.host + window.location.pathname,
    slot_id: params.slotId,
  });

  window.open(
    redirect +
      "?utm_campaign=" +
      campaign_name +
      "&" +
      "utm_content=" +
      (params.isMobile ? EImageSize.MOB : EImageSize.DESK) +
      "&" +
      "slot_id=" +
      params.slotId +
      "&" +
      "utm_source=" +
      curUrl,
    "_blank",
  );
};

const GetitAdPlugin = (props: IProps) => {
  const [useImageUrl, setImageUrl] = useState<string>("");
  const [useRedirect, setRedirect] = useState<string>("");
  const [useCompany, setCompany] = useState<string>("");
  const [useCompanyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const init = async (): Promise<void> => {
      const data: IGetAd | void = await getImage(props);
      if (!data) {
        return;
      }
      setImageUrl(data.image_url);
      setRedirect(data.redirect_link);
      setCompany(data.campaign_uuid);
      setCompanyName(data.campaign_name);
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
        height: "90px",
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
        <a onClick={async () => await generateUrl(props, useCompany, useCompanyName, useRedirect)}>
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
