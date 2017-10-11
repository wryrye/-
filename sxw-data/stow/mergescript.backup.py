#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Oct 16 19:24:06 2016

@author: ryan
"""


import csv

#with open('sentences.csv','r') as inp:
#    writer = csv.writer(open('filtered2.csv', 'w+'))
#    for row in csv.reader(inp, delimiter='\t'):
#        if row[1] == 'cmn':
#            writer.writerow(row)


with open('filtered2.csv','r') as cmn, open('links.csv','r') as links, open('sentences.csv','r') as sents:
    writer = csv.writer(open('merged.csv', 'w'))
    for rowi in csv.reader(cmn):
        print(rowi)
        for rowj in csv.reader(links, delimiter='\t'):
            if rowj[0] == rowi[0]:
                out = rowj[1];
                trans = [None,None,None]
                #print(out)
                for rowk in csv.reader(sents, delimiter='\t'):
                    if rowk[0] == out:
                        trans = rowk
                        break
                    if int(rowk[0]) > int(out):
                        break
                #print(trans[2])
                if trans[1] == 'eng':
                    print(trans[2])
                    writer.writerow(rowi+trans[2:3])
                    links.seek(0)
                    sents.seek(0)
                    break
        links.seek(0)
        sents.seek(0)
                    #elif rowk[0] > out:
                       # break
                        #writer.writerow(rowi + rowk[2])
                        #print(rowk)
print("hello")
                        
                        



       
     #      writer.writerow(row)
     #rowk[1] == 'eng
     #print(rowi + rowk[2])
