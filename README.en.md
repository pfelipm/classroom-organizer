[🇪🇸 Versión en español](README.md) | [🦎 Versió en català](README.ca.md)

# Classroom Organizer 🏷️

**Classroom Organizer** is a Chrome extension to **tag, search, filter and sort your [Google Classroom](https://classroom.google.com) classes**, which today can only be rearranged by dragging them one by one. It adds an organization layer built into the Classroom home page that feels like a native feature of the platform.

It is the sister extension of [NotebookLM Organizer](https://github.com/pfelipm/notebooklm-organizer) and shares its way of working.

> 🚧 **In development (v0.6.7).** The extension is being tested and is not yet published on the Chrome Web Store. For now it is installed manually: see "Try the development version". The screenshot is provisional; final screenshots will be added when version 1.0 is ready for launch and publication.

![Classroom Organizer on the Google Classroom home page](assets/captura-general.png)

---

## 🧪 Try the development version

Thank you for helping to test Classroom Organizer before it is published! Your feedback is what can improve it the most.

### Install it
1. Download **[classroom-organizer-dev.zip](https://github.com/pfelipm/classroom-organizer/releases/download/dev/classroom-organizer-dev.zip)**. The link always points to the latest version.
2. Unzip it into a folder you won't delete (for example, in *Documents*). Inside there is a folder called **`classroom-organizer`**.
3. Open `chrome://extensions`, turn on **Developer mode** (top right), click **Load unpacked** and choose that `classroom-organizer` folder.
4. Open or reload [Google Classroom](https://classroom.google.com).

> ⚠️ If your device or Chrome profile is managed by your school, it may not let you turn on developer mode. In that case, try with your personal Chrome profile.

### Update it without losing your tags
1. Just in case, export a backup (**↓** button in the **Manage tags** panel).
2. Download the ZIP again and replace the contents of the `classroom-organizer` folder with the new ones.
3. In `chrome://extensions`, click Classroom Organizer's reload button (**↻**) and reload your Classroom tabs.

**Don't uninstall it to update it:** uninstalling deletes your tags (see "Your data").

### What we are especially interested in
- How it behaves with **many classes** and with cards showing **upcoming work**.
- Classroom in **other languages** (Galician, Basque…) and on **Chromebooks**.
- **Syncing** across several devices with the same Chrome profile.
- Anything that isn't clear at first, looks odd or that you miss.

### Send feedback
Open a **[GitHub issue](https://github.com/pfelipm/classroom-organizer/issues/new/choose)** and choose **🐞 Error** or **💡 Sugerencia** (suggestion): the form guides you. Include the version shown at the bottom of the **Manage tags** panel and **don't include student data** in screenshots. If you don't have a GitHub account, contact me on [LinkedIn](https://www.linkedin.com/in/pfelipm/).

---

## 🔒 Privacy and security

Classroom Organizer is designed around the principle of **least access required**:

- **No access to content:** the extension **never** reads, accesses or processes the content of your classes: no assignments, materials, students or grades.
- **Visible metadata only:** for each class on the home page it only reads its **name** and the **internal identifier** in its link. The identifier is used to attach your tags; search only uses the class name and its tags.
- **It changes nothing in Classroom:** sorting, filtering or tagging only changes **what you see** in your browser. The class order saved in Classroom, class names and settings are left untouched.
- **No Classroom API or sensitive permissions:** the extension only requests the `storage` and `activeTab` permissions (the latter only when you click its icon) and only runs on `classroom.google.com`.
- **Your data is yours:** your tags and preferences are stored in your Chrome account (via Chrome Sync) and only you can access them.

---

## ✨ Key features

- 🏷️ **Color tags:** create tags with a color palette to classify your classes visually. Each new tag gets the least used color, so colors don't repeat.
- 🔍 **Search and filtering:** find classes instantly by searching their names and tags (ignoring case and accents), combined with tag filters using **AND** or **OR** logic.
- 🔤 **Sort by name:** sort the view alphabetically (A-Z or Z-A) with natural ordering ("2nd" before "10th"). The Classroom side panel follows the same order.
- ✅ **Bulk tagging:** select several classes (click, Shift+click or "Select visible") and add or remove tags on all of them at once, with undo.
- ⭐ **Priority tags:** star the tags you always want to see first on each class.
- 📐 **Tags that fit:** each card shows as many tags as fit and groups the rest into "+N".
- 👩‍🏫 **In every view:** works in "Teaching", "Enrolled" and "Archived classes".
- 🎛️ **Full management panel:** create, rename, recolor and delete tags while seeing how many classes each one has, with a quick filter, automatic text contrast and a synced storage meter.
- 🔄 **Automatic sync:** your tags and preferences sync across all your devices through your Chrome account.
- 💾 **Backups:** export and import your settings as JSON, choosing which parts to restore.
- 🌐 **Multi-language:** interface in **Spanish, English and Catalan**, switchable instantly from the management panel.
- 🚀 **Quick access:** click the extension icon to open Google Classroom in a new tab (if you are already on Classroom, it does nothing).

---

## 🧰 Advanced organization

### 🔍 Search
The search box above the class list finds classes as you type:

- **Where it searches:** in the **class name** and in the names of **all its tags** (even those hidden behind "+N" on the card).
- **Ignores case and accents:** "fisica" finds "Física y Química".
- **Matches parts of words:** "math" finds "Mathematics" (and "tic" also finds "Mathema**tic**s").
- **Several words:** **all** of them must appear, in **any order**, in the name or in the tags: "phy 4" finds "Physics 4th A"; "eso group" finds classes tagged "ESO" and "Group A".
- **Clear the search:** press **Esc** in the box or the **✕** button on its right.

### 🏷️ Tag filters
All your tags appear below the search box: click one to see only the classes that have it, and click it again to remove the filter.

- With **two or more active tags**, the **AND / OR** switch appears:
  - **AND:** classes that have **all** the selected tags.
  - **OR:** classes that have **any** of them.
- Search and filters combine: only classes meeting both conditions are shown.
- The counter ("7 of 14 classes") shows how many are visible; **Clear filters** removes both the search and the active tags.
- Search and filters are kept when switching between "Teaching", "Enrolled" and "Archived classes". The AND/OR mode is saved.

### ✅ Bulk tagging
1. Click **Select** in the extension toolbar. A checkbox appears on each card and a floating bar at the bottom.
2. Mark the classes: a **click** anywhere on a card selects it (without opening it), **Shift+click** selects a range in the order they are shown and **Select visible** adds every class shown by the current search and filters. **Space** marks the focused card.
3. Click **Tag**. Each tag shows whether all selected classes have it, some (with a count) or none: clicking it adds it to all or, if all already have it, removes it from all. You can also create a new tag and apply it to the selection.
4. After each change, a notice with **Undo** appears for a few seconds. Closing the window after a change ends selection mode; closing it without changes keeps the selection.

**Esc** closes the tagging window and, pressed again, exits selection mode (if you are typing in the search box, it clears it first). Switching views also exits selection mode.

### ⭐ Priority tags
In the management panel, the **star** next to each tag marks it as a priority tag: it will be shown before the others on every class, so it will be the last one to be hidden behind "+N". Among several priority tags, and among the rest, the **order in which they were assigned to each class** is kept.

### 📐 Tags on each class
- Tags appear at the bottom of each card, aligned with the class name. If Classroom shows upcoming work on the card, the extension leaves room so it is never covered.
- Each card shows as many tags as fit and groups the rest into **"+N"**; click it to see them all. Hovering over a tag only shows the full list if some are hidden or its name is truncated.
- The **×** on each tag removes it from that class.
- The **tag** button on the bottom row of the card (next to Classroom's icons) opens the tagging window for that class. It appears when you hover over the card; on touch screens it is always visible.
- In the tagging window, **Enter** applies the tag with that name or, if there is none, the first one in the filtered list ("math" → Mathematics); it only creates a new tag if nothing matches.

### 🔤 View order and manual rearranging
- The **Sort** selector offers "Classroom order" (yours), "Name (A-Z)" and "Name (Z-A)". The side panel follows the same order.
- Sorting **only changes what you see**: the order saved in Classroom is not modified and comes back as soon as you choose "Classroom order".
- While the view is sorted by name, filtered or in selection mode, **Classroom's manual rearranging** (dragging cards or the "Move" option in their menu) is **paused**, because it would apply to a view different from the real one. A note below the toolbar reminds you.

---

## 🛠️ Installation

### Chrome Web Store
*Coming soon.* It will be the recommended way to install it, and the only possible one in many schools, where the Google Workspace administrator can install it on every teacher's device.

### Manual installation (developer mode)
To review the code or contribute (to test it, it's easier to follow "Try the development version"):

1. Download and unzip the ZIP file or clone this repository.
2. Open Google Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the project's **`extension`** folder.
5. Open or reload [Google Classroom](https://classroom.google.com).

> ⚠️ In many schools, school-managed devices and Chrome profiles **do not allow** developer mode or manually loaded extensions. In that case, please wait for the Chrome Web Store version.

**To update a manual installation** there is no need to uninstall it (and it is better not to: see the "Your data" section). Replace the files in the folder with those of the new version and click the extension's reload button (↻) in `chrome://extensions`. Then reload any open Classroom tabs.

---

## 💾 Your data: where it is stored and when it can be lost

### Where it is stored
Your tags, their assignment to classes and your preferences are stored in **Chrome Sync**, the synced storage of your Chrome profile. That way they are available on every device where you use that profile with the extension installed. Chrome allows about **100 KB** per extension; the management panel shows how much is used, and the extension warns you above 80% and if syncing ever fails.

### Backups
In the management panel, the **↓** button exports all your settings to a JSON file (`classroom-organizer-YYYY-MM-DD.json`) and the **↑** button imports it. When importing you can choose which parts replace the current ones: **tags**, **class tagging** and **preferences**. The file is checked before importing, so a damaged file or one from another extension is rejected without touching your data.

**Backups are the universal safety net:** make one from time to time and, above all, before uninstalling the extension or switching from the manual installation to the store one.

### Store vs. manual installation
The official way to install the extension is the **Chrome Web Store**. Manual installation exists to test the extension, review the code or contribute, and has a few differences:

- **Same identifier on every manual installation:** `manifest.json` includes a public key (`key`) that always gives the extension the same ID (`lolmnldccjfekckioeldgcolppkcalim`), no matter which folder it is loaded from. This way Chrome Sync recognizes it as the same extension on all your devices. Even though the ID is the same for everyone, your data remains tied exclusively to your account.
- **Local backup copy:** on manual installations, the extension also keeps a copy on the device itself. If the cloud is empty when you open Classroom (for example, because you uninstalled the extension on another device), it restores that copy and uploads it again.
- **Notice in the panel:** the management panel reminds you to export before uninstalling, and "(dev)" appears next to the version.
- The store version has **a different ID**, so its data and that of a manual installation are **not shared**: to move from one to the other, export in one and import in the other.

### When data can be lost (or stop being visible)

| Situation | What happens | How to avoid it |
|---|---|---|
| Uninstalling the extension (store or manual) | Chrome deletes its synced data from your account and, with sync on, on your other devices too | Export a backup before uninstalling |
| Uninstalling on one device while another has a manual installation | When Classroom is opened on the device that kept it, its local copy restores the data to the cloud | Keep it installed on at least one device, or export |
| Switching from the manual installation to the store one (or vice versa) | They are extensions with different IDs: data is **not shared** (not lost, but not visible) | Export in one and import in the other |
| Loading a manual version older than 0.6.0 or with a different `key` | The ID is different: data saved under the other ID is no longer visible | Export before and import after |
| Chrome profile not signed in, or with extension sync turned off | Data only lives on that device and is lost when uninstalling or deleting the profile | Sign in to Chrome with sync on, or export |
| Chrome Sync storage full (about 100 KB) | Changes stop syncing (the extension warns you) | Export and delete tags you no longer use |
| Several Chrome profiles (e.g., personal and school) | Each profile has its own data; they don't mix | Export in one profile and import in the other if you want to share them |

### Why is there no reconciliation system like in NotebookLM Organizer?
NotebookLM Organizer includes an elaborate mechanism for manual installations: local and cloud copies, three safety modes and a wizard that compares both copies and lets you merge them. Classroom Organizer deliberately opts for something simpler:

- Teachers usually work on **school-managed Chromebooks or profiles**, where the administrator almost always blocks developer mode. Manual installation will be the exception.
- The natural path in a school is **installing from the Chrome Web Store**, which the administrator can force on every device.
- Even with the store version, uninstalling deletes synced data: an **exported backup** protects you in every case.

That is why only the simple, effective pieces are kept: the fixed ID, the local copy with automatic restore, the warnings, and export and import.

---

## ⚙️ Technical details

- **No frameworks or dependencies:** plain JavaScript and CSS, no bundler. Scripts are loaded in order from the manifest and share a namespace (`CO`).
- **Manifest V3.**
- **A single module knows the Classroom page** (`src/classroom/adapter.js`): all selectors live there and use stable attributes (data and accessibility attributes), never Google's internal class names. If Classroom changes, it is fixed in one place.
- **Single-page application:** Classroom does not reload the page when switching views and keeps previous views hidden. The extension watches for changes with a `MutationObserver` and always works on the visible view.
- **Sorting without touching the page:** sorting by name uses the CSS `order` property on the cards and side panel links, without moving them, and Classroom's manual rearranging is paused by intercepting its events.
- **Chunked Chrome Sync:** data is split into chunks measured in real bytes to respect the 8 KB per-item limit. New chunks are written before stale ones are deleted, so a failed write never leaves the cloud empty.
- **Safe reloads:** if the extension is updated or reloaded while Classroom is open, the old copy of the script detects that it has been disconnected and withdraws cleanly, without errors.
- **Permissions:**
  - `storage`: to store and sync your tags and preferences.
  - `activeTab`: only when you click the extension icon, to check whether the current tab is already Classroom and, if not, open it in a new tab.
  - Access to `classroom.google.com` comes from the content script itself.

### Code structure

```
extension/
├── manifest.json
├── background.js            Icon click → opens Classroom
├── styles.css               Styles (light theme only: Classroom has no dark mode)
├── _locales/{es,en,ca}/     Translations
└── src/
    ├── core/                i18n.js, store.js (Chrome Sync), tags.js (tag model)
    ├── classroom/           adapter.js: the ONLY module that knows the Classroom page
    ├── features/            view-order.js, drag-lock.js, filters.js, selection.js, backup.js
    ├── ui/                  toolbar, card tags, windows, management panel, notices
    └── content.js           Startup and update cycle
scripts/package-webstore.py  Builds the Chrome Web Store ZIP (without the "key")
assets/                      Icon sources
```

> **To publish your own version on the Chrome Web Store:** run `python3 scripts/package-webstore.py`. It builds `classroom-organizer-vX.Y.Z.zip` from the `extension` folder but **without the `key` property** of the manifest, which the store does not accept (it assigns its own ID). That way there is only one manifest to maintain.

---

## 📝 A note on maintenance

Classroom Organizer works by analyzing the structure of the Google Classroom page, which Google can change at any time without notice. Maintenance in response to those changes will be done on a voluntary basis; this is a community-driven, open-source project.

---

## 🤝 Credits

This project was created and is maintained by **Pablo Felip** ([LinkedIn](https://www.linkedin.com/in/pfelipm/) | [GitHub](https://github.com/pfelipm)).

---

## 📄 License

This project is distributed under the terms of the [GNU Affero General Public License v3.0](LICENSE).
