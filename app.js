const footnoteInput = document.getElementById("footnote-input");
const xmlPreview = document.getElementById("xml-preview");
const generateButton = document.getElementById("generate-button");
const copyButton = document.getElementById("copy-button");

const segmentedControl = document.getElementById("segmented-control");
const tabLockscreen = document.getElementById("tab-lockscreen");
const tabRestrictions = document.getElementById("tab-restrictions");
const panelLockscreen = document.getElementById("panel-lockscreen");
const panelRestrictions = document.getElementById("panel-restrictions");

const toggleCamera = document.getElementById("toggle-camera");
const toggleSiri = document.getElementById("toggle-siri");
const toggleScreenshot = document.getElementById("toggle-screenshot");
const toggleAirdrop = document.getElementById("toggle-airdrop");
const toggleAppRemoval = document.getElementById("toggle-app-removal");
const toggleSafari = document.getElementById("toggle-safari");

function generateXML() {
  const userText = footnoteInput.value.trim() || "Swipe Up to Unlock";

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>ConfigKit Profile</string>
    <key>PayloadIdentifier</key>
    <string>com.configkit.profile</string>
    <key>PayloadUUID</key>
    <string>3A4D2702-8664-4CEB-B61E-2B0302E4E105</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>Lock Screen Message</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.lockscreen.footnote</string>
            <key>PayloadUUID</key>
            <string>4B1E9021-A925-46D9-89B7-910D67634C2B</string>
            <key>PayloadType</key>
            <string>com.apple.shareddeviceconfiguration</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>LockScreenFootnote</key>
            <string>${userText}</string>
        </dict>
        <dict>
            <key>PayloadDisplayName</key>
            <string>System Restrictions</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.restrictions.access</string>
            <key>PayloadUUID</key>
            <string>9D4A6108-3319-4F2B-8A55-1C0983E7B214</string>
            <key>PayloadType</key>
            <string>com.apple.applicationaccess</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>allowCamera</key>
            <${!toggleCamera.checked}/>
            <key>allowAssistant</key>
            <${!toggleSiri.checked}/>
            <key>allowScreenShot</key>
            <${!toggleScreenshot.checked}/>
            <key>allowAirDrop</key>
            <${!toggleAirdrop.checked}/>
            <key>allowAppRemoval</key>
            <${!toggleAppRemoval.checked}/>
            <key>allowSafari</key>
            <${!toggleSafari.checked}/>
        </dict>
    </array>
</dict>
</plist>`;
}

function updatePreview() {
  xmlPreview.textContent = generateXML();
}

tabLockscreen.addEventListener("click", function() {
  segmentedControl.classList.remove("restrictions-active");
  tabLockscreen.classList.add("active");
  tabRestrictions.classList.remove("active");
  panelLockscreen.classList.remove("hidden");
  panelRestrictions.classList.add("hidden");
});

tabRestrictions.addEventListener("click", function() {
  segmentedControl.classList.add("restrictions-active");
  tabRestrictions.classList.add("active");
  tabLockscreen.classList.remove("active");
  panelRestrictions.classList.remove("hidden");
  panelLockscreen.classList.add("hidden");
});

footnoteInput.addEventListener("input", updatePreview);
toggleCamera.addEventListener("change", updatePreview);
toggleSiri.addEventListener("change", updatePreview);
toggleScreenshot.addEventListener("change", updatePreview);
toggleAirdrop.addEventListener("change", updatePreview);
toggleAppRemoval.addEventListener("change", updatePreview);
toggleSafari.addEventListener("change", updatePreview);

updatePreview();

generateButton.addEventListener("click", function() {
  generateButton.disabled = true;
  generateButton.textContent = "Generating...";
  generateButton.style.opacity = "0.7";

  setTimeout(function() {
    const xmlContent = generateXML();
    const blob = new Blob([xmlContent], { type: "application/x-apple-aspen-config" });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "ConfigKit.mobileconfig";
    document.body.appendChild(link);
    link.click();

    generateButton.textContent = "Generated";
    generateButton.style.backgroundColor = "#34c759";
    generateButton.style.opacity = "1";

    setTimeout(function() {
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      generateButton.disabled = false;
      generateButton.textContent = "Generate .mobileconfig";
      generateButton.style.backgroundColor = "";
    }, 1000);
  }, 500);
});

copyButton.addEventListener("click", function() {
  navigator.clipboard.writeText(xmlPreview.textContent);
  copyButton.textContent = "Copied";
  copyButton.style.backgroundColor = "#34c759";
  copyButton.style.color = "#ffffff";

  setTimeout(function() {
    copyButton.textContent = "Copy XML";
    copyButton.style.backgroundColor = "";
    copyButton.style.color = "";
  }, 1000);
});