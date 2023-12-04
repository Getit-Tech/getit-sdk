# **Getit ad plugin**

## Installation

To get started with the getit ad plugin you need to download it from npm or yarn.

```
npm install getit-sdk
```

```
yarn add getit-sdk
```

## Usage

Once the package is in your project, simply import it from your folder

```
import { GetitAdPlugin } from "getit-sdk";
```

Then insert the Getit plugin where you need

```
<GetitAdPlugin
    apiKey="xxx_xxx_xxx"
    walletConnected={address ? address : ""}
    isMobile={false | true}
    slotId="number as string"
/>
```

These 4 params are required.

1. Api key will be given to you by the Getut team, it should be stored in privately.
2. walletConnected - here should be passed wallet address in ethereum format. Or nothing.
3. isMobile - this is the resolution param. If it is true - return mobile size image, else - desktop. It can always be true, if you need an ad to be small.
4. slotId - current number of banners. If you are using multiple banners the number should increment by +1.

## Information for ad owners.

How to track clicks on ads? We are using POST request to generate a redirect url and it looks like this -

```
const urlToRedirect = redirect +
    "?utm_campaign=" +
    companyName +
    "&" +
    "utm_content=" +
    (params.isMobile ? EImageSize.MOB : EImageSize.DESK) +
    "&" +
    "slot_id=" +
    params.slotId +
    "&" +
    "utm_source=" +
    curUrl,
```

1. Redirect - this is your website
2. Company name - this is the set name when the company is creating 
3. Banner size - size of the banner 
4. Slot id - id of the clicked banner 
5. Redirected from - url of dapp 
