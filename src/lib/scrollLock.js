// One shared page scroll lock. The intro, the menu, and every popup can each
// hold it; scrolling only comes back when the last one lets go. Each overlay
// setting body overflow on its own let them undo each other: a popup opened
// during the intro could restore "locked" after the intro had already finished.
const holders = new Set();

export function lockScroll(key) {
    holders.add(key);
    document.body.style.overflow = 'hidden';
}

export function unlockScroll(key) {
    holders.delete(key);
    if (holders.size === 0) document.body.style.overflow = '';
}
