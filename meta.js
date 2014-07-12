#define SCRIPT_NAME         Yays! (Yet Another Youtube Script)
#define SCRIPT_DESCRIPTION  A lightweight and non-intrusive userscript that control video playback and set the preferred player size and playback quality on YouTube.
#define SCRIPT_VERSION      RELEASE_VERSION
#define SCRIPT_RELEASE_DATE RELEASE_DATE
#define SCRIPT_NS           yays
\
#define SCRIPT_SITE_ROOT https://eugenox.appspot.com
#define SCRIPT_SITE      SCRIPT_SITE_ROOT/script/yays
\
#define SCRIPT_AUTHOR    Eugene Nouvellieu <eugenox_gmail_com>
\
#define ASTERIX *
\
// ==UserScript==
// @name        SCRIPT_NAME
// @namespace   youtube
// @description SCRIPT_DESCRIPTION
// @version     SCRIPT_VERSION
// @author      SCRIPT_AUTHOR
// @license     MIT License
// @include     http*://ASTERIX.youtube.com/ASTERIX
// @include     http*://youtube.com/ASTERIX
// @run-at      document-start
// @noframes
// @grant       unsafeWindow
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @homepageURL SCRIPT_SITE
// @updateURL   SCRIPT_SITE_ROOT/blob/yays/yays.meta.js
// @downloadURL SCRIPT_SITE_ROOT/blob/yays/yays.user.js
// @icon        SCRIPT_SITE_ROOT/blob/yays/yays.icon.png
// ==/UserScript==
