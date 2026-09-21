function generateProfileXML(footnoteText) {
  const profileUUID = crypto.randomUUID();
  const payloadUUID = crypto.randomUUID();

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadDisplayName</key>
    <string>ConfigKit Lock Screen</string>
    <key>PayloadDescription</key>
    <string>Sets a custom footnote message on the Lock Screen.</string>
    <key>PayloadOrganization</key>
    <string>ConfigKit</string>
    <key>PayloadIdentifier</key>
    <string>com.configkit.profile</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${profileUUID}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>Lock Screen Message</string>
            <key>PayloadDescription</key>
            <string>Configures LockScreenFootnote</string>
            <key>PayloadType</key>
            <string>com.apple.shareddeviceconfiguration</string>
            <key>PayloadIdentifier</key>
            <string>com.configkit.lockscreen</string>
            <key>PayloadUUID</key>
            <string>${payloadUUID}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>LockScreenFootnote</key>
            <string>${footnoteText}</string>
        </dict>
    </array>
</dict>
</plist>`;
}