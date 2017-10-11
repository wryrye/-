#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 16 19:24:06 2016

@author: ryan
"""


import csv
import sys
from mafan import simplify, tradify


with open(sys.argv[1],'r') as fout:
    writer = csv.writer(open('simplified.csv', 'w'))
    count = 0
    for rowi in csv.reader(fout):
        
        rowi = [s.decode('utf-8') for s in rowi]
        row2 = rowi[0:2] + [simplify(rowi[2])] + rowi[3:4]
        row3 = [s.encode('utf-8') for s in row2]
        
        writer.writerows([row3])
        count+=1
    print count
        
 string = u'這是什麼啊'
