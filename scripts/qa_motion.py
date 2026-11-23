"""Faas 5/6 motioni koondkontroll (2026-11-23): Chromium / WebKit / Firefox × 1440 / 768 / 390 + reduced.
Eeldab dev-serverit pordil 3031. Käivitus: python scripts/qa_motion.py [chromium webkit firefox]
Rida jooksu kohta: reduced-staatika, laadimisel peidus, läbikerimise järel jääke 0, geomeetria = reduced, ankur, menüühüpe, menüü → Enquire, lukk."""
import time, sys
from playwright.sync_api import sync_playwright
U = 'http://localhost:3031/'
RES = """() => [...document.querySelectorAll('main *, #contact *')].filter(e => e.style.opacity !== '' || e.style.clipPath !== '' || (e.tagName === 'IMG' && e.style.transform !== '') || (e.tagName === 'svg' && e.style.transform !== '')).map(e => { const r = e.getBoundingClientRect(); return [(e.closest('section[id]')||{}).id || 'hero', e.className.baseVal ?? e.className, Math.round(r.top), Math.round(r.bottom)] })"""
GEO = """() => [...document.querySelectorAll('main section[id], .hero, #contact .sign, #contact .portrait, footer')].map(e => Math.round(e.getBoundingClientRect().top + scrollY))"""
VBH = r"""(lim) => { const out = []; for (const e of document.querySelectorAll('main *, #contact *')) { const r = e.getBoundingClientRect(); if (r.height < 4 || r.bottom <= 0 || r.top >= innerHeight * lim) continue; const cs = getComputedStyle(e); const m = /^inset\(([\d.]+)%/.exec(cs.clipPath); if ((+cs.opacity < .05 && e.style.opacity !== '') || (m && +m[1] > 99)) out.push(e.className.baseVal ?? e.className) } return out }"""
def ctx(b, eng, w, h, **kw):
    o = {'viewport': {'width': w, 'height': h}}
    if w < 700 and eng != 'firefox': o.update(has_touch=True, is_mobile=True)
    o.update(kw); c = b.new_context(**o); pg = c.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:120])); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text[:120]))
    return c, pg, errs
def wheel_to_end(pg, w, h):
    pg.mouse.move(w / 2, h / 2)
    total = pg.evaluate('document.documentElement.scrollHeight - innerHeight'); t0 = time.time()
    while pg.evaluate('scrollY') < total - 5 and time.time() - t0 < 60:
        try: pg.mouse.wheel(0, 150)
        except Exception: pg.evaluate('scrollBy(0, 150)')
        time.sleep(.1)
    if pg.evaluate('scrollY') < total - 5: pg.evaluate('scrollTo(0, 1e6)')   # varu (WebKit mobiili emulatsioon rattata)
    time.sleep(3)
with sync_playwright() as p:
    for eng in sys.argv[1:] or ('chromium', 'webkit', 'firefox'):
        b = getattr(p, eng).launch()
        for w, h in [x for x in [(1440, 900), (768, 1024), (390, 844)] if not (eng == 'webkit' and x[0] > 400 and 'skipwk' in sys.argv)]:
            line = []; allerr = []
            # reduced baseline
            c, pg, e = ctx(b, eng, w, h, reduced_motion='reduce'); pg.goto(U, wait_until='networkidle'); time.sleep(1)
            red_res = len(pg.evaluate(RES)); pg.evaluate('scrollTo(0, 1e6)'); time.sleep(.5); geo0 = pg.evaluate(GEO); red_vbh = pg.evaluate(VBH, 1); allerr += e; c.close()
            line.append(f'reduced: residue {red_res}, hidden {len(red_vbh)}')
            # motion läbikerimine
            c, pg, e = ctx(b, eng, w, h); pg.goto(U, wait_until='networkidle'); time.sleep(1.5)
            intro = pg.evaluate("[document.documentElement.classList.contains('mo-intro'), document.documentElement.hasAttribute('data-mo-late')]")
            n0 = len(pg.evaluate(RES)); hero_vbh = pg.evaluate(VBH, 1)
            wheel_to_end(pg, w, h)
            res = pg.evaluate(RES); geo1 = pg.evaluate(GEO); ovf = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            dg = [a - b2 for a, b2 in zip(geo1, geo0) if abs(a - b2) > 1]
            line.append(f'intro(mo-intro,late)={intro} hiddenAtLoad {n0} heroHidden {len(hero_vbh)} | end residue {len(res)} {res[:3]} geoDiff {dg} hOverflow {ovf}')
            allerr += e; c.close()
            # ankur
            c, pg, e = ctx(b, eng, w, h); pg.goto(U + '#ownership', wait_until='networkidle'); time.sleep(3)
            line.append(f'anchor vbh {pg.evaluate(VBH, .85)} top {pg.evaluate("Math.round(document.querySelector(`#ownership`).getBoundingClientRect().top)")}'); allerr += e; c.close()
            # menüü + Enquire
            c, pg, e = ctx(b, eng, w, h); pg.goto(U, wait_until='networkidle'); time.sleep(1.5)
            pg.evaluate('scrollTo(0, 300)'); time.sleep(1.2)
            pg.click('button.menu'); time.sleep(.6)
            mop = pg.evaluate("[getComputedStyle(document.querySelector('#menu-panel')).opacity, document.documentElement.style.overflow]")
            pg.click('#menu-panel a[href$="#buying"]'); time.sleep(1.5)
            jump = pg.evaluate("Math.round(document.querySelector('#buying').getBoundingClientRect().top)"); jv = pg.evaluate(VBH, .85)
            pg.click('button.menu'); time.sleep(.6); pg.click('#menu-panel [data-enquire]'); time.sleep(.6)
            eo = pg.evaluate("[getComputedStyle(document.querySelector('.sheet')).opacity, getComputedStyle(document.querySelector('#menu-panel')).visibility, document.documentElement.style.overflow]")
            pg.keyboard.press('Escape'); time.sleep(.5)
            ec = pg.evaluate("[getComputedStyle(document.querySelector('.sheet')).visibility, document.documentElement.style.overflow]")
            y0 = pg.evaluate('scrollY')
            try: pg.mouse.move(w/2, h/2); pg.mouse.wheel(0, 300)
            except Exception: pg.evaluate('scrollBy(0, 300)')
            time.sleep(1.2); moved = pg.evaluate('scrollY') - y0
            line.append(f'menu open {mop} jump #buying top {jump} vbh {jv} | menu->enq {eo} close {ec} wheel after close moved {moved}')
            allerr += e; c.close()
            print(f'== {eng} {w}x{h}'); [print('   ', l) for l in line]; print('    errors:', allerr); sys.stdout.flush()
        b.close()
