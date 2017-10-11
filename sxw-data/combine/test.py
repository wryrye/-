#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 16 19:24:06 2016

@author: ryan
"""


import csv
import sys


with open(sys.argv[1],'r') as cmn:
    #writer = csv.writer(open('fixed-'+sys.argv[1]+'.csv', 'w'))
    count = 0
    for rowi in csv.reader(cmn):
        temp=list(rowi)
        fmt=u'{:<15}'*len(temp)
        print fmt.format(*[s.decode('utf-8') for s in temp])
#      count+=1
#    print count
       