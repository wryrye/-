#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 16 19:24:06 2016

@author: ryan
"""


import csv
import sys


with open(sys.argv[1],'r') as cmn:
    writer = csv.writer(open('fixed-'+sys.argv[1]+'.csv', 'w'))
    for rowi in csv.reader(cmn):
      writer.writerow(rowi[0:3]+rowi[4:5])
      print(rowi[0])