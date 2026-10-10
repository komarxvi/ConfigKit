const footnoteInput = document.getElementById("footnote-input");
const xmlPreview = document.getElementById("xml-preview");
const generateButton = document.getElementById("generate-button");

function generateXML(userText) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>ConfigKit Lock Screen</string>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.shareddeviceconfiguration</string>
            <key>LockScreenFootnote</key>
            <string>${userText}</string>
        </dict>
    </array>
</dict>
</plist>`;
}

footnoteInput.addEventListener("input", function() { xmlPreview.textContent = generateXML(footnoteInput.value); });
    // Update the XML preview here

 generateButton.addEventListener("click", function() {
   if (!footnoteInput.value.trim()) {
     alert("Please enter a lock screen message.");
     return;
   }

   const xmlContent = generateXML(footnoteInput.value);
   const blob = new Blob([xmlContent], { type: "application/x-apple-aspen-config" });
   const downloadUrl = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = downloadUrl;
link.download = "ConfigKit.mobileconfig";
document.body.appendChild(link);
link.click();

  setTimeout(function() {
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }, 1500);
});

xmlPreview.textContent = generateXML(footnoteInput.value || "Swipe Up to Unlock");

