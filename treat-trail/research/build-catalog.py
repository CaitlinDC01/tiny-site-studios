#!/usr/bin/env python3
"""Turn the dated merchant audit into the public, clearly conditional discovery catalog."""
import csv, json
from pathlib import Path
root=Path(__file__).resolve().parent
rows=list(csv.DictReader((root/'deal-audit-2026-10-04.csv').open(newline='')))
existing={"Sephora","Chick-fil-A","Chuy's","Olive Garden","Nothing Bundt Cakes","Chili's","Denny's","Houston TX Hot Chicken","Tacos A Go Go"}
exclude={"Dunkin'","Baskin-Robbins","Krispy Kreme"}
items=[]
for row in rows:
    name=row['brand']
    if name in existing or name in exclude: continue
    rule=row['purchase_rule'].lower()
    purchase='no' if rule.startswith('none') else 'yes' if any(x in rule for x in ('purchase required','prior qualifying','prior purchase','order required','dining visit','meal','purchase to earn')) else 'unknown'
    window=row['redemption_window'].lower()
    reward_window='month' if 'birthday month' in window and 'check' not in window and 'vary' not in window and 'defer' not in window else 'day' if window=='birthday day' else 'custom'
    scope=row['scope']
    city='National' if scope=='National' else 'Houston' if 'Houston' in scope or scope=='Texas' else 'National'
    category='Coffee' if name=='7-Eleven' else row['category']
    items.append(dict(id='audit-'+name.lower().replace(' ','-').replace("'",'').replace('&','and').replace('.',''),business=name,offer=row['offer'],category=category,reward_window=reward_window,lead_days=None,purchase=purchase,signup=row['signup_or_prior_activity'],enroll_url=row['enrollment_url'],source=row['official_terms_url'],address='',city=city,area='Choose a participating location',notes=f"{row['editorial_note']} Purchase rule: {row['purchase_rule']}. Window: {row['redemption_window']}. Research status: {row['confidence']}.",confirmed=False,verified_at='2026-10-04',audit_status=row['confidence']))
assert len(items)==35
(root.parent/'catalog.js').write_text('/* Generated from research/deal-audit-2026-10-04.csv. Conditional offers require visitor confirmation. */\nconst researchCatalog='+json.dumps(items,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(items),'additional discovery entries; 9 existing + 35 = 44 current offers')
