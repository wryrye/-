#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 16 19:24:06 2016

@author: ryan
"""


import csv
import sys


with open(sys.argv[1],'r') as cmn:
    writer = csv.writer(open('mastermerge.csv', 'a'))
    #count = 0
    for rowi in csv.reader(cmn):
      writer.writerow(rowi)
      print(rowi)
  #    count+=1
 #   print(count)
cmn.close()