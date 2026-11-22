#!/usr/bin/env python3
"""MARESOL tokenikontroll (kohandatud tõestatud mustrist Vue/Nuxti jaoks).

Leiab CSS-i (css-failid ja html <style> / style=""), mis läheb mööda tokenisüsteemist (DESIGN-SYSTEM.md).
Toorväärtused (px, rem, vw, hex, ms, z-index) tohivad olla ainult app/assets/css/tokens.css-is.
Rollidefineerimine (font-*, line-height, letter-spacing) tohib olla ainult app/assets/css/base.css-is.

Kasutus:
  python scripts/lint-tokens.py               # kontrollib app/assets/css/*.css (v.a tokens.css) ja app/**/*.vue <style> plokid
  python scripts/lint-tokens.py fail1 fail2   # kontrollib ainult neid
Erand ühele reale: lisa samale reale kommentaar  /* lint-ok: põhjus */  (erandid loetakse aruandes eraldi).
Väljumiskood 1, kui rikkumisi on.
"""
import re, sys, pathlib

sys.stdout.reconfigure(encoding="utf-8")
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE_FILES = {"base.css"}                          # siin tohib rolle määrata

SPACING = r"(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?|gap|row-gap|column-gap|top|right|bottom|left|inset(-(inline|block)(-(start|end))?)?|width|height|(min|max)-(width|height)|flex-basis|aspect-ratio|border(-(top|right|bottom|left))?-width|outline-width|grid-template-(columns|rows)|translate"
SPACING_RE = re.compile(rf"^({SPACING})$")
TIME_RE = re.compile(r"^(transition(-[a-z]+)?|animation(-[a-z]+)?)$")
FONT_RE = re.compile(r"^(font|font-family|font-size|font-weight|font-style|line-height|letter-spacing)$")
COLOR_RE = re.compile(r"^(color|background(-color|-image)?|border(-(top|right|bottom|left))?(-color)?|outline(-color)?|fill|stroke|box-shadow|text-shadow|caret-color|accent-color)$")
BORDER_SHORT_RE = re.compile(r"^(border(-(top|right|bottom|left))?|outline)$")

ALLOWED_VIEWPORT = {"100svh", "100dvh", "100vh", "100vw", "100svw", "100dvw"}
UNIT_RE = re.compile(r"(?<![\w.#-])(-?\d*\.?\d+)(px|rem|em|vw|vh|svh|dvh|vmin|vmax|ch|ms|s)\b")
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
FUNC_COLOR_RE = re.compile(r"\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(", re.I)
NAMED_RE = re.compile(r"\b(white|black)\b", re.I)
ZINT_RE = re.compile(r"^-?\d+$")
MEDIA_RE = re.compile(r"\((min|max)-(width|height)\s*:\s*([\d.]+)(px|em|rem)\)")
ALLOWED_W = {600, 700, 760, 900}
ALLOWED_H = {820}


def strip_vars(v: str) -> str:
    """Eemalda var(...) koos tagavaraga (sulgude tasakaaluga)."""
    out, i = "", 0
    while i < len(v):
        if v.startswith("var(", i):
            depth, j = 0, i + 3
            while j < len(v):
                if v[j] == "(":
                    depth += 1
                elif v[j] == ")":
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            out += " "
            i = j + 1
        else:
            out += v[i]
            i += 1
    return out


def blank_comments(text: str) -> str:
    return re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)


def css_chunks(path: pathlib.Path):
    """Anna (css_tekst, esimese rea nihe) – html-ist <style> plokid ja style-atribuudid."""
    raw = path.read_text(encoding="utf-8", errors="replace")
    if path.suffix == ".css":
        yield raw, 0, raw
        return
    for m in re.finditer(r"<style[^>]*>(.*?)</style>", raw, flags=re.S | re.I):   # html ja .vue
        yield m.group(1), raw[: m.start(1)].count("\n"), raw
    for m in re.finditer(r'(?<![:\w-])style="([^"]*)"', raw, flags=re.I):   # staatiline style="", mitte :style
        yield "{" + m.group(1) + "}", raw[: m.start(1)].count("\n"), raw


def check_value(prop, val, is_base):
    val = val.replace("!important", " ").strip()
    pv = strip_vars(val)
    if prop == "text-shadow" and val != "none":
        return "text-shadow on keelatud (hele tekst, AI_KULDREEGLID §16)"
    if FONT_RE.match(prop) and not is_base:
        return "rolli omadus (font-*, line-height, letter-spacing) tohib olla ainult base.css-is: kasuta klassi .t-*"
    if FONT_RE.match(prop):
        return None
    if COLOR_RE.match(prop) or BORDER_SHORT_RE.match(prop):
        if HEX_RE.search(pv) or FUNC_COLOR_RE.search(pv) or NAMED_RE.search(pv):
            return "toorvärv: kasuta paletitokenit (--ground, --surface, --ink, --soft) või color-mix() nendest"
    if SPACING_RE.match(prop) or TIME_RE.match(prop) or BORDER_SHORT_RE.match(prop):
        chk = pv
        for k in ALLOWED_VIEWPORT:
            chk = chk.replace(k, " ")
        for m in UNIT_RE.finditer(chk):
            if float(m.group(1)) != 0:
                return f"toorväärtus {m.group(0)}: kasuta tokenit (vt DESIGN-SYSTEM.md)"
    if prop == "z-index":
        if pv.strip() and ZINT_RE.match(pv.strip()) and pv.strip() not in {"0", "1", "-1"}:
            return "z-index number: kasuta --z-* tokenit"
    if "!important" in val and not is_base:
        return "!important"
    return None


def brace_balance(path: pathlib.Path):
    """Üleliigne `}` neelab järgmise reegli vaikselt (Faas 4.5: .index-list kaotas margin-top'i). Tagastab (rida, sõnum) paarid."""
    text = blank_comments(path.read_text(encoding='utf-8'))
    depth, line, out = 0, 1, []
    for ch in text:
        if ch == "\n":
            line += 1
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth < 0:
                out.append((line, 'liigne }'))
                depth = 0
    if depth > 0:
        out.append((line, f'{depth} sulgemata {{'))
    return out


def lint_file(path: pathlib.Path):
    is_base = path.name in BASE_FILES
    viol, exc = [], []
    for text, line_off, raw_full in css_chunks(path):
        raw_lines = (text if path.suffix == ".css" else text).split("\n")
        clean = blank_comments(text)
        if path.name != "tokens.css" and re.search(r"@font-face", clean):
            ln = clean[: clean.index("@font-face")].count("\n") + 1 + line_off
            viol.append((ln, "@font-face", "", "@font-face tohib olla ainult tokens.css-is"))
        for m in MEDIA_RE.finditer(clean):
            at = clean.rfind("@", 0, m.start())
            if at >= 0 and clean.startswith("@container", at):
                continue   # konteinerpäring = veeru laius, mitte ekraani murdepunkt (Homes 2026-11-22)
            kind, dim, num, unit = m.groups()
            n = float(num)
            ok = unit == "px" and ((dim == "width" and n in ALLOWED_W) or (dim == "height" and n in ALLOWED_H))
            if not ok:
                ln = clean[: m.start()].count("\n") + 1 + line_off
                viol.append((ln, "@media", m.group(0), "murdepunkt väljaspool 600 / 700 / 760 / 900 px (kõrgus 820 px)"))
        for m in re.finditer(r"([a-zA-Z-]+)\s*:\s*([^;{}]+?)\s*(;|(?=}))", clean):
            prop, val = m.group(1).lower(), m.group(2)
            if prop.startswith("--"):
                if path.name != "tokens.css":
                    ln = clean[: m.start()].count("\n") + 1 + line_off
                    line_txt = raw_lines[clean[: m.start()].count("\n")] if clean[: m.start()].count("\n") < len(raw_lines) else ""
                    (exc if "lint-ok:" in line_txt else viol).append((ln, prop, val.strip(), "kohalik token: lisa tokens.css-i, mitte sektsiooni"))
                continue
            why = check_value(prop, val, is_base)
            if why:
                idx = clean[: m.start()].count("\n")
                line_txt = raw_lines[idx] if idx < len(raw_lines) else ""
                ln = idx + 1 + line_off
                (exc if "lint-ok:" in line_txt else viol).append((ln, prop, val.strip(), why))
    return viol, exc


def default_files():
    files = []
    for p in sorted((ROOT / "app" / "assets" / "css").glob("*.css")):
        if p.name != "tokens.css":
            files.append(p)
    files += sorted((ROOT / "app").rglob("*.vue"))
    return files


def main():
    files = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or default_files()
    total_v = total_e = 0
    for f in files:
        v, e = lint_file(f)
        if f.suffix == '.css':
            for ln, msg in brace_balance(f):
                v.append((ln, 'sulg', msg, 'CSS sulgude tasakaal: üks `}` liiga palju või vähe lõhub järgmist reeglit'))
        rel = f.relative_to(ROOT) if ROOT in f.parents else f
        for ln, prop, val, why in v:
            print(f"{rel}:{ln}  {prop}: {val}  -> {why}")
        total_v += len(v)
        total_e += len(e)
    print(f"\nfaile {len(files)}, rikkumisi {total_v}, erandeid (lint-ok) {total_e}")
    sys.exit(1 if total_v else 0)


if __name__ == "__main__":
    main()
