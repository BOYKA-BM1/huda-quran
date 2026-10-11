#!/usr/bin/env python3
"""يولّد www/css/paper.css: تصحيحات المظهر الورقي للألوان الثابتة في الكود القديم.
  • خلفيات خضراء داكنة شفافة  → أسطح ورقية فاتحة
  • نصوص ذهبية/كريمية فاتحة   → ذهبي غامق / حبر
  • (inline styles) عبر attribute selectors
التشغيل:  python3 scripts/gen-paper.py   (يُعاد بعد أي تعديل ألوان في app.css)"""
import re, glob, os, sys
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
WWW=os.path.join(ROOT,'www')
def rd(p): return open(p,encoding='utf-8').read()

COL=re.compile(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)|#([0-9a-fA-F]{6})\b|#([0-9a-fA-F]{3})\b')
def parse(m):
    if m.group(1) is not None: return int(m.group(1)),int(m.group(2)),int(m.group(3)),float(m.group(4)) if m.group(4) else 1.0
    h=m.group(5) or ''.join(c*2 for c in m.group(6)); return int(h[0:2],16),int(h[2:4],16),int(h[4:6],16),1.0
def colors(v): return [parse(m) for m in COL.finditer(v)]
def is_dark_tint(c):
    r,g,b,a=c; return max(r,g,b)<=75 and not (r==g==b==0) and a>=0.08
def is_gold_text(c):
    r,g,b,a=c; return r>=170 and g>=130 and b<=175 and r-b>=45
def is_cream_text(c):
    r,g,b,a=c; return min(r,g,b)>=185 and max(r,g,b)>=225 and not (r==g==b==255) and not (r-b>=60 and b<150)
PASTEL={ (200,230,201):'#1B6B3A',(232,122,122):'#B42318',(252,165,165):'#B42318',(239,68,68):'#B42318',(122,232,122):'#1B6B3A',(134,239,172):'#1B6B3A',(74,222,128):'#1B6B3A',(168,212,180):'#1B6B3A',(76,175,125):'#1B6B3A',(221,160,221):'#7A3F7A',(255,100,100):'#B42318'}
def _lum(c):
    f=lambda v:((v/255)/12.92 if v/255<=.03928 else (((v/255)+.055)/1.055)**2.4)
    return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])
def text_map(c):
    r,g,b,a=c
    if (r,g,b)==(255,255,255) and a<0.95: return 'var(--tm)'
    if (r,g,b) in PASTEL: return PASTEL[(r,g,b)]
    if is_gold_text(c): return None if a<0.3 else '#6B4C0A'   # الذهبي الباهت جداً زخرفة — يُترك
    if is_cream_text(c): return 'var(--cr)'
    if not (r==g==b) and _lum(c)>0.30 and a>=0.5:       # ألوان زاهية (أزرق/أخضر فاتح…) → نسخة أغمق مقروءة على الورق
        return '#%02x%02x%02x'%(int(r*.52),int(g*.52),int(b*.52))
    return None
def is_brown(c):
    r,g,b,a=c; return 120<=r<=165 and 70<=g<=125 and b<=45 and a>=0.1
def bg_map(v):
    cs=colors(v)
    if cs and any(is_brown(c) for c in cs) and not any(is_dark_tint(c) for c in cs): return 'rgba(201,168,76,.2)' if 'gradient' not in v else 'var(--em2)'
    if not cs or not any(is_dark_tint(c) for c in cs): return None
    if 'gradient' in v: return 'var(--em)'
    a=max(c[3] for c in cs if is_dark_tint(c))
    return 'rgba(255,252,242,%.2f)'%min(.92,max(.55,a*1.9))

def strip_comments(s): return re.sub(r'/\*.*?\*/','',s,flags=re.S)
def walk(s,ctx,out):
    i=0
    while i<len(s):
        j=s.find('{',i)
        if j<0: break
        head=s[i:j].strip(); depth=1; k=j+1
        while depth and k<len(s):
            depth+= (s[k]=='{') - (s[k]=='}'); k+=1
        body=s[j+1:k-1]
        if head.startswith('@media') or head.startswith('@supports'): walk(body,ctx+[head],out)
        elif head.startswith('@'): pass
        else: out.append((ctx,head,body))
        i=k
def decls(body): return [d.strip() for d in re.split(r';(?![^(]*\))',body) if ':' in d]

out=['/* مُولَّد بواسطة scripts/gen-paper.py — لا تعدّله يدوياً */','body.theme-paper::before{background-image:none!important}','body.theme-paper .gbg{display:none!important}']
src=[os.path.join(WWW,'css',f) for f in ['app.css','features.css']]
rules=[]
for f in src: walk(strip_comments(rd(f)),[],rules)
# CSS مكتوب داخل سلاسل JavaScript (حقن <style> وقت التشغيل)
jscss=[]
for f in sorted(glob.glob(os.path.join(WWW,'js','app.0*.js')))+[os.path.join(WWW,'js',n) for n in ('ui-handlers.js','features-ui.js')]:
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'",rd(f)):
        t=m.group(1)
        if '{' in t and '}' in t and ':' in t and re.match(r'^\s*[.#@a-zA-Z*\[:>][^{}]*\{',t): jscss.append(t.replace("\\'","'"))
walk(strip_comments('\n'.join(jscss)),[],rules)
print('css rules found in JS strings:',len(jscss))
n_rules=0
for ctx,sel,body in rules:
    if 'theme-' in sel or 'data-mode' in sel: continue
    ov=[]
    for d in decls(body):
        prop,_,val=d.partition(':'); prop=prop.strip().lower(); val=val.strip()
        if prop in ('background','background-color','background-image'):
            m=bg_map(val)
            if m: ov.append(('background-image:none;background-color:%s'%m) if prop=='background-image' else 'background:%s'%m)
        elif prop=='color':
            cs=colors(val)
            if len(cs)==1:
                t=text_map(cs[0])
                if t: ov.append('color:'+t)
    if not ov: continue
    sels=[x.strip() for x in sel.split(',') if x.strip()]
    pref=','.join('body.theme-paper '+x for x in sels)
    rule=pref+'{'+';'.join(o+'!important' for o in ov)+'}'
    for c in reversed(ctx): rule=c+'{'+rule+'}'
    out.append(rule); n_rules+=1

# ── inline styles (HTML + JS templates): attribute selectors ──
srcs=[os.path.join(WWW,'index.html')]+sorted(glob.glob(os.path.join(WWW,'js','*.js')))
inl_text={}; inl_bg=set()
for f in srcs:
    s=rd(f)
    for m in re.finditer(r'(?<![-\w])color\s*:\s*(rgba?\([^)]*\)|#[0-9a-fA-F]{3,6}\b)',s):
        tok=m.group(1); cs=colors(tok)
        if len(cs)==1:
            t=text_map(cs[0])
            if t: inl_text[tok.replace(' ','').lower()]=t
    for m in re.finditer(r'background(?:-color)?\s*:\s*([^;\"\'`]+)',s):
        v=m.group(1)
        for mm in COL.finditer(v):
            c=parse(mm)
            if is_dark_tint(c) or is_brown(c): inl_bg.add(mm.group(0).replace(' ','').lower())
for f in srcs:
    for m in re.finditer(r'#[0-9a-fA-F]{6}\b',rd(f)):
        c=parse(re.match(COL,m.group(0))) if False else None
for f in srcs:
    for mm in COL.finditer(rd(f)):
        c=parse(mm)
        if (is_dark_tint(c) and c[3]>=0.3) or (is_brown(c) and c[3]>=0.3): inl_bg.add(mm.group(0).replace(' ','').lower())
def variants(tok):
    """كل الصيغ التي قد يظهر بها اللون في attribute style (كما كُتب، أو كما يُسلسله المتصفح)"""
    c=colors(tok)[0]; r,g,b=c[0],c[1],c[2]
    v={tok}
    v|={'rgb(%d,%d,%d)'%(r,g,b),'rgb(%d, %d, %d)'%(r,g,b),'rgba(%d,%d,%d'%(r,g,b),'rgba(%d, %d, %d'%(r,g,b)}
    if tok.startswith('#') and len(tok)==7: v.add(tok.upper())
    return v
for tok,t in sorted(inl_text.items()):
    sels=[]
    for v in variants(tok):
        for pre in (';color:','; color:',' color:',';color: ','; color: '):
            sels.append('body.theme-paper [style*="%s%s"]'%(pre,v))
        for pre in ('color:','color: '):
            sels.append('body.theme-paper [style^="%s%s"]'%(pre,v))
    out.append(','.join(sels)+'{color:%s!important}'%t)
_seen=set(); _uniq=[]
for tok in sorted(inl_bg):
    c=colors(tok)[0]; k=(c[0],c[1],c[2])
    if k in _seen: continue
    _seen.add(k); _uniq.append(re.sub(r',[\d.]+\)$',')',tok) if tok.startswith('rgba') else tok)
inl_bg=set(_uniq)
for tok in sorted(inl_bg):
    sels=[]
    for v in variants(tok):
        for pre in ('background:','background: ','background-color:','background-color: '):
            sels.append('body.theme-paper [style*="%s%s"]'%(pre,v))
    out.append(','.join(sels)+'{background:rgba(255,252,242,.82)!important}')
# أي inline style فيه gradient + لون داكن من القائمة → سطح ورقي (مثل بطاقات أسماء الله الملوّنة)
for tok in sorted(inl_bg):
    sels=[]
    for v in variants(tok): sels.append('body.theme-paper [style*="gradient"][style*="%s"]'%v)
    out.append(','.join(sels)+'{background:var(--em)!important}')
# تدرّجات داكنة داخل inline: أي style فيه linear-gradient بلون داكن
out.append('body.theme-paper [style*="gradient"][style*="rgba(13,59,46"],body.theme-paper [style*="gradient"][style*="rgba(3,10,6"],body.theme-paper [style*="gradient"][style*="#030a06"],body.theme-paper [style*="gradient"][style*="#0d3b2e"]{background:var(--em)!important}')
css='\n'.join(out)+'\n'
css=re.sub(r'\[style([*^]=)"([^"]*)"\]',lambda m:'[style%s"%s" i]'%(m.group(1),m.group(2)),css)
open(os.path.join(WWW,'css','paper.css'),'w',encoding='utf-8').write(css)
print('class rules:',n_rules,'| inline text colors:',len(inl_text),'| inline dark bgs:',len(inl_bg),'| bytes:',os.path.getsize(os.path.join(WWW,'css','paper.css')))
