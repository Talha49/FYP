"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { FaDownload } from 'react-icons/fa';
import { PiFileTextThin } from 'react-icons/pi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

function  DualLines({ selectedDate }) {

  const [chartData, setChartData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  const allData = [
   // January 2022
   {date: "2022-01-04", name: 'Talha', gender: 'Male', quantity: 2400, Age: 21},
   {date: "2022-01-04", name: 'Usama', gender: 'Male', quantity: 1398, Age: 56},
   {date: "2022-01-04", name: 'Saleem Bhai', gender: 'Male', quantity: 9800, Age: 60},
   {date: "2022-01-04", name: 'Ahmad', gender: 'Male', quantity: 3908, Age: 24},
   {date: "2022-01-04", name: 'Hamidi', gender: 'Female', quantity: 7800, Age: 89},
   {date: "2022-01-04", name: 'Natasha', gender: 'Female', quantity: 3800, Age: 69},
   {date: "2022-01-04", name: 'Gul', gender: 'Female', quantity: 1800, Age: 49},
   {date: "2022-01-04", name: 'Malala', gender: 'Female', quantity: 8800, Age: 29},
   
   {date: "2022-01-08", name: 'Aliya', gender: 'Female', quantity: 4300, Age: 78},
   {date: "2022-01-08", name: 'Faisal', gender: 'Male', quantity: 6700, Age: 34},
   {date: "2022-01-08", name: 'Rizwan', gender: 'Male', quantity: 5400, Age: 41},
   {date: "2022-01-08", name: 'Sadia', gender: 'Female', quantity: 6300, Age: 28},
   {date: "2022-01-08", name: 'Maha', gender: 'Female', quantity: 4800, Age: 62},
   {date: "2022-01-08", name: 'Amna', gender: 'Female', quantity: 2900, Age: 45},
   {date: "2022-01-08", name: 'Shahid', gender: 'Male', quantity: 7600, Age: 55},
   {date: "2022-01-08", name: 'Ayesha', gender: 'Female', quantity: 9100, Age: 38},
   
   {date: "2022-01-02", name: 'Jawad', gender: 'Male', quantity: 2300, Age: 48},
   {date: "2022-01-02", name: 'Rashid', gender: 'Male', quantity: 5900, Age: 65},
   {date: "2022-01-02", name: 'Sara', gender: 'Female', quantity: 8100, Age: 22},
   {date: "2022-01-02", name: 'Waqas', gender: 'Male', quantity: 4100, Age: 39},
   {date: "2022-01-02", name: 'Zara', gender: 'Female', quantity: 6600, Age: 50},
   {date: "2022-01-02", name: 'Asma', gender: 'Female', quantity: 3400, Age: 58},
   {date: "2022-01-02", name: 'Kamran', gender: 'Male', quantity: 9200, Age: 44},
   {date: "2022-01-02", name: 'Nida', gender: 'Female', quantity: 7500, Age: 35},


    // July 2022
  {date: "2022-07-22", name: 'Hassan', gender: 'Male', quantity: 2700, Age: 26},
  {date: "2022-07-22", name: 'Umer', gender: 'Male', quantity: 6900, Age: 52},
  {date: "2022-07-22", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
  {date: "2022-07-22", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
  {date: "2022-07-22", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
  {date: "2022-07-22", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
  {date: "2022-07-22", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
  {date: "2022-07-22", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},
  
  {date: "2022-07-13", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
  {date: "2022-07-13", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
  {date: "2022-07-13", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
  {date: "2022-07-13", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
  {date: "2022-07-13", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
  {date: "2022-07-13", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
  {date: "2022-07-13", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
  {date: "2022-07-13", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},
  
  {date: "2022-07-19", name: 'Yasir', gender: 'Male', quantity: 2400, Age: 40},
  {date: "2022-07-19", name: 'Noman', gender: 'Male', quantity: 7500, Age: 55},
  {date: "2022-07-19", name: 'Saima', gender: 'Female', quantity: 9200, Age: 32},
  {date: "2022-07-19", name: 'Waseem', gender: 'Male', quantity: 6300, Age: 45},
  {date: "2022-07-19", name: 'Hina', gender: 'Female', quantity: 8100, Age: 28},
  {date: "2022-07-19", name: 'Shahzad', gender: 'Male', quantity: 9900, Age: 50},
  {date: "2022-07-19", name: 'Aqeel', gender: 'Male', quantity: 1100, Age: 26},
  {date: "2022-07-19", name: 'Rubab', gender: 'Female', quantity: 4500, Age: 36},
  
  // September 2022
  {date: "2022-09-21", name: 'Talha', gender: 'Male', quantity: 2700, Age: 30},
  {date: "2022-09-21", name: 'Usama', gender: 'Male', quantity: 6900, Age: 52},
  {date: "2022-09-21", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
  {date: "2022-09-21", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
  {date: "2022-09-21", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
  {date: "2022-09-21", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
  {date: "2022-09-21", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
  {date: "2022-09-21", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},
  
  {date: "2022-09-11", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
  {date: "2022-09-11", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
  {date: "2022-09-11", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
  {date: "2022-09-11", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
  {date: "2022-09-11", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
  {date: "2022-09-11", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
  {date: "2022-09-11", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
  {date: "2022-09-11", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},
  
  {date: "2022-09-12", name: 'Yasir', gender: 'Male', quantity: 2400, Age: 40},
  {date: "2022-09-12", name: 'Noman', gender: 'Male', quantity: 7500, Age: 55},
  {date: "2022-09-12", name: 'Saima', gender: 'Female', quantity: 9200, Age: 32},
  {date: "2022-09-12", name: 'Waseem', gender: 'Male', quantity: 6300, Age: 45},
  {date: "2022-09-12", name: 'Hina', gender: 'Female', quantity: 8100, Age: 28},
  {date: "2022-09-12", name: 'Shahzad', gender: 'Male', quantity: 9900, Age: 50},
  {date: "2022-09-12", name: 'Aqeel', gender: 'Male', quantity: 1100, Age: 26},
  {date: "2022-09-12", name: 'Rubab', gender: 'Female', quantity: 4500, Age: 36},
  
   // December 2022
   {date: "2022-12-21", name: 'Talha', gender: 'Male', quantity: 2700, Age: 30},
   {date: "2022-12-21", name: 'Usama', gender: 'Male', quantity: 6900, Age: 52},
   {date: "2022-12-21", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
   {date: "2022-12-21", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
   {date: "2022-12-21", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
   {date: "2022-12-21", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
   {date: "2022-12-21", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
   {date: "2022-12-21", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},
   
   {date: "2022-12-11", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
   {date: "2022-12-11", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
   {date: "2022-12-11", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
   {date: "2022-12-11", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
   {date: "2022-12-11", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
   {date: "2022-12-11", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
   {date: "2022-12-11", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
   {date: "2022-12-11", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},
   
   {date: "2022-12-12", name: 'Yasir', gender: 'Male', quantity: 2400, Age: 40},
   {date: "2022-12-12", name: 'Noman', gender: 'Male', quantity: 7500, Age: 55},
   {date: "2022-12-12", name: 'Saima', gender: 'Female', quantity: 9200, Age: 32},
   {date: "2022-12-12", name: 'Waseem', gender: 'Male', quantity: 6300, Age: 45},
   {date: "2022-12-12", name: 'Hina', gender: 'Female', quantity: 8100, Age: 28},
   {date: "2022-12-12", name: 'Shahzad', gender: 'Male', quantity: 9900, Age: 50},
   {date: "2022-12-12", name: 'Aqeel', gender: 'Male', quantity: 1100, Age: 26},
   {date: "2022-12-12", name: 'Rubab', gender: 'Female', quantity: 4500, Age: 36},
 
// February 2023
{date: "2023-02-15", name: 'Jawad', gender: 'Male', quantity: 2300, Age: 48},
{date: "2023-02-15", name: 'Rashid', gender: 'Male', quantity: 5900, Age: 65},
{date: "2023-02-15", name: 'Sara', gender: 'Female', quantity: 8100, Age: 22},
{date: "2023-02-15", name: 'Waqas', gender: 'Male', quantity: 4100, Age: 39},
{date: "2023-02-15", name: 'Zara', gender: 'Female', quantity: 6600, Age: 50},
{date: "2023-02-15", name: 'Asma', gender: 'Female', quantity: 3400, Age: 58},
{date: "2023-02-15", name: 'Kamran', gender: 'Male', quantity: 9200, Age: 44},
{date: "2023-02-15", name: 'Nida', gender: 'Female', quantity: 7500, Age: 35},

{date: "2023-02-20", name: 'Hassan', gender: 'Male', quantity: 2700, Age: 26},
{date: "2023-02-20", name: 'Umer', gender: 'Male', quantity: 6900, Age: 52},
{date: "2023-02-20", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
{date: "2023-02-20", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
{date: "2023-02-20", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
{date: "2023-02-20", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
{date: "2023-02-20", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
{date: "2023-02-20", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},

{date: "2023-02-25", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
{date: "2023-02-25", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
{date: "2023-02-25", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
{date: "2023-02-25", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
{date: "2023-02-25", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
{date: "2023-02-25", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
{date: "2023-02-25", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
{date: "2023-02-25", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},

 // March 2023
 {date: "2023-03-02", name: 'Talha', gender: 'Male', quantity: 2400, Age: 21},
 {date: "2023-03-02", name: 'Usama', gender: 'Male', quantity: 1398, Age: 56},
 {date: "2023-03-02", name: 'Saleem Bhai', gender: 'Male', quantity: 9800, Age: 60},
 {date: "2023-03-02", name: 'Ahmad', gender: 'Male', quantity: 3908, Age: 24},
 {date: "2023-03-02", name: 'Hamidi', gender: 'Female', quantity: 7800, Age: 89},
 {date: "2023-03-02", name: 'Natasha', gender: 'Female', quantity: 3800, Age: 69},
 {date: "2023-03-02", name: 'Gul', gender: 'Female', quantity: 1800, Age: 49},
 {date: "2023-03-02", name: 'Malala', gender: 'Female', quantity: 8800, Age: 29},
 
 {date: "2023-03-12", name: 'Aliya', gender: 'Female', quantity: 4300, Age: 78},
 {date: "2023-03-12", name: 'Faisal', gender: 'Male', quantity: 6700, Age: 34},
 {date: "2023-03-12", name: 'Rizwan', gender: 'Male', quantity: 5400, Age: 41},
 {date: "2023-03-12", name: 'Sadia', gender: 'Female', quantity: 6300, Age: 28},
 {date: "2023-03-12", name: 'Maha', gender: 'Female', quantity: 4800, Age: 62},
 {date: "2023-03-12", name: 'Amna', gender: 'Female', quantity: 2900, Age: 45},
 {date: "2023-03-12", name: 'Shahid', gender: 'Male', quantity: 7600, Age: 55},
 {date: "2023-03-12", name: 'Ayesha', gender: 'Female', quantity: 9100, Age: 38},
 
 {date: "2023-03-22", name: 'Jawad', gender: 'Male', quantity: 2300, Age: 48},
 {date: "2023-03-22", name: 'Rashid', gender: 'Male', quantity: 5900, Age: 65},
 {date: "2023-03-22", name: 'Sara', gender: 'Female', quantity: 8100, Age: 22},
 {date: "2023-03-22", name: 'Waqas', gender: 'Male', quantity: 4100, Age: 39},
 {date: "2023-03-22", name: 'Zara', gender: 'Female', quantity: 6600, Age: 50},
 {date: "2023-03-22", name: 'Asma', gender: 'Female', quantity: 3400, Age: 58},
 {date: "2023-03-22", name: 'Kamran', gender: 'Male', quantity: 9200, Age: 44},
 {date: "2023-03-22", name: 'Nida', gender: 'Female', quantity: 7500, Age: 35},

 // May 2023
 {date: "2023-05-05", name: 'Hassan', gender: 'Male', quantity: 2700, Age: 26},
 {date: "2023-05-05", name: 'Umer', gender: 'Male', quantity: 6900, Age: 52},
 {date: "2023-05-05", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
 {date: "2023-05-05", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
 {date: "2023-05-05", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
 {date: "2023-05-05", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
 {date: "2023-05-05", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
 {date: "2023-05-05", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},
 
 {date: "2023-05-15", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
 {date: "2023-05-15", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
 {date: "2023-05-15", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
 {date: "2023-05-15", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
 {date: "2023-05-15", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
 {date: "2023-05-15", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
 {date: "2023-05-15", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
 {date: "2023-05-15", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},
 
 {date: "2023-05-25", name: 'Yasir', gender: 'Male', quantity: 2400, Age: 40},
 {date: "2023-05-25", name: 'Noman', gender: 'Male', quantity: 7500, Age: 55},
 {date: "2023-05-25", name: 'Saima', gender: 'Female', quantity: 9200, Age: 32},
 {date: "2023-05-25", name: 'Waseem', gender: 'Male', quantity: 6300, Age: 45},
 {date: "2023-05-25", name: 'Hina', gender: 'Female', quantity: 8100, Age: 28},
 {date: "2023-05-25", name: 'Shahzad', gender: 'Male', quantity: 9900, Age: 50},
 {date: "2023-05-25", name: 'Aqeel', gender: 'Male', quantity: 1100, Age: 26},
 {date: "2023-05-25", name: 'Rubab', gender: 'Female', quantity: 4500, Age: 36},

 // June 2023
 {date: "2023-06-01", name: 'Talha', gender: 'Male', quantity: 2400, Age: 21},
 {date: "2023-06-01", name: 'Usama', gender: 'Male', quantity: 1398, Age: 56},
 {date: "2023-06-01", name: 'Saleem Bhai', gender: 'Male', quantity: 9800, Age: 60},
 {date: "2023-06-01", name: 'Ahmad', gender: 'Male', quantity: 3908, Age: 24},
 {date: "2023-06-01", name: 'Hamidi', gender: 'Female', quantity: 7800, Age: 89},
 {date: "2023-06-01", name: 'Natasha', gender: 'Female', quantity: 3800, Age: 69},
 {date: "2023-06-01", name: 'Gul', gender: 'Female', quantity: 1800, Age: 49},
 {date: "2023-06-01", name: 'Malala', gender: 'Female', quantity: 8800, Age: 29},
 
 {date: "2023-06-12", name: 'Aliya', gender: 'Female', quantity: 4300, Age: 78},
 {date: "2023-06-12", name: 'Faisal', gender: 'Male', quantity: 6700, Age: 34},
 {date: "2023-06-12", name: 'Rizwan', gender: 'Male', quantity: 5400, Age: 41},
 {date: "2023-06-12", name: 'Sadia', gender: 'Female', quantity: 6300, Age: 28},
 {date: "2023-06-12", name: 'Maha', gender: 'Female', quantity: 4800, Age: 62},
 {date: "2023-06-12", name: 'Amna', gender: 'Female', quantity: 2900, Age: 45},
 {date: "2023-06-12", name: 'Shahid', gender: 'Male', quantity: 7600, Age: 55},
 {date: "2023-06-12", name: 'Ayesha', gender: 'Female', quantity: 9100, Age: 38},
 
 {date: "2023-06-22", name: 'Jawad', gender: 'Male', quantity: 2300, Age: 48},
 {date: "2023-06-22", name: 'Rashid', gender: 'Male', quantity: 5900, Age: 65},
 {date: "2023-06-22", name: 'Sara', gender: 'Female', quantity: 8100, Age: 22},
 {date: "2023-06-22", name: 'Waqas', gender: 'Male', quantity: 4100, Age: 39},
 {date: "2023-06-22", name: 'Zara', gender: 'Female', quantity: 6600, Age: 50},
 {date: "2023-06-22", name: 'Asma', gender: 'Female', quantity: 3400, Age: 58},
 {date: "2023-06-22", name: 'Kamran', gender: 'Male', quantity: 9200, Age: 44},
 {date: "2023-06-22", name: 'Nida', gender: 'Female', quantity: 7500, Age: 35},

 // July 2023
 {date: "2023-07-03", name: 'Hassan', gender: 'Male', quantity: 2700, Age: 26},
 {date: "2023-07-03", name: 'Umer', gender: 'Male', quantity: 6900, Age: 52},
 {date: "2023-07-03", name: 'Aisha', gender: 'Female', quantity: 8300, Age: 20},
 {date: "2023-07-03", name: 'Omer', gender: 'Male', quantity: 9500, Age: 46},
 {date: "2023-07-03", name: 'Sana', gender: 'Female', quantity: 5600, Age: 31},
 {date: "2023-07-03", name: 'Rahim', gender: 'Male', quantity: 4200, Age: 60},
 {date: "2023-07-03", name: 'Najma', gender: 'Female', quantity: 9000, Age: 44},
 {date: "2023-07-03", name: 'Kashif', gender: 'Male', quantity: 1100, Age: 27},
 
 {date: "2023-07-13", name: 'Shoaib', gender: 'Male', quantity: 6300, Age: 35},
 {date: "2023-07-13", name: 'Sobia', gender: 'Female', quantity: 9100, Age: 29},
 {date: "2023-07-13", name: 'Fahad', gender: 'Male', quantity: 4800, Age: 42},
 {date: "2023-07-13", name: 'Amir', gender: 'Male', quantity: 6600, Age: 51},
 {date: "2023-07-13", name: 'Zainab', gender: 'Female', quantity: 2700, Age: 25},
 {date: "2023-07-13", name: 'Ali', gender: 'Male', quantity: 8100, Age: 48},
 {date: "2023-07-13", name: 'Fatima', gender: 'Female', quantity: 9300, Age: 39},
 {date: "2023-07-13", name: 'Bilal', gender: 'Male', quantity: 4500, Age: 33},
 
 {date: "2023-07-23", name: 'Yasir', gender: 'Male', quantity: 2400, Age: 40},
 {date: "2023-07-23", name: 'Noman', gender: 'Male', quantity: 7500, Age: 55},
 {date: "2023-07-23", name: 'Saima', gender: 'Female', quantity: 9200, Age: 32},
 {date: "2023-07-23", name: 'Waseem', gender: 'Male', quantity: 6300, Age: 45},
 {date: "2023-07-23", name: 'Hina', gender: 'Female', quantity: 8100, Age: 28},
 {date: "2023-07-23", name: 'Shahzad', gender: 'Male', quantity: 9900, Age: 50},
 {date: "2023-07-23", name: 'Aqeel', gender: 'Male', quantity: 1100, Age: 26},
 {date: "2023-07-23", name: 'Rubab', gender: 'Female', quantity: 4500, Age: 36},

 // January 2024
 {date: "2024-01-05", name: 'Rohan', gender: 'Male', quantity: 2800, Age: 29},
 {date: "2024-01-05", name: 'Priya', gender: 'Female', quantity: 9600, Age: 25},
 {date: "2024-01-05", name: 'Karan', gender: 'Male', quantity: 7100, Age: 38},
 {date: "2024-01-05", name: 'Riya', gender: 'Female', quantity: 8400, Age: 22},
 {date: "2024-01-05", name: 'Siddharth', gender: 'Male', quantity: 9100, Age: 42},
 {date: "2024-01-05", name: 'Aisha', gender: 'Female', quantity: 7600, Age: 35},
 {date: "2024-01-05", name: 'Rahul', gender: 'Male', quantity: 4800, Age: 48},
 {date: "2024-01-05", name: 'Nalini', gender: 'Female', quantity: 9200, Age: 50},
 
 {date: "2024-01-15", name: 'Vijay', gender: 'Male', quantity: 6300, Age: 55},
 {date: "2024-01-15", name: 'Sonia', gender: 'Female', quantity: 8100, Age: 32},
 {date: "2024-01-15", name: 'Rajesh', gender: 'Male', quantity: 6600, Age: 45},
 {date: "2024-01-15", name: 'Shreya', gender: 'Female', quantity: 2700, Age: 28},
 {date: "2024-01-15", name: 'Amit', gender: 'Male', quantity: 8100, Age: 39},
 {date: "2024-01-15", name: 'Juhi', gender: 'Female', quantity: 9300, Age: 41},
 {date: "2024-01-15", name: 'Sumeet', gender: 'Male', quantity: 4500, Age: 33},
 {date: "2024-01-15", name: 'Kavita', gender: 'Female', quantity: 7500, Age: 36},
 
 {date: "2024-01-25", name: 'Yogesh', gender: 'Male', quantity: 2400, Age: 40},
 {date: "2024-01-25", name: 'Neha', gender: 'Female', quantity: 9200, Age: 30},
 {date: "2024-01-25", name: 'Rakesh', gender: 'Male', quantity: 7500, Age: 50},
 {date: "2024-01-25", name: 'Rashmi', gender: 'Female', quantity: 8400, Age: 27},
 {date: "2024-01-25", name: 'Sachin', gender: 'Male', quantity: 9900, Age: 48},
 {date: "2024-01-25", name: 'Pooja', gender: 'Female', quantity: 7600, Age: 34},
 {date: "2024-01-25", name: 'Vikram', gender: 'Male', quantity: 1100, Age: 26},
 {date: "2024-01-25", name: 'Swati', gender: 'Female', quantity: 4500, Age: 37},

  // February 2024
  {date: "2024-02-05", name: 'Rahul', gender: 'Male', quantity: 2900, Age: 29},
  {date: "2024-02-05", name: 'Nisha', gender: 'Female', quantity: 9700, Age: 25},
  {date: "2024-02-05", name: 'Kunal', gender: 'Male', quantity: 7200, Age: 38},
  {date: "2024-02-05", name: 'Rashi', gender: 'Female', quantity: 8500, Age: 22},
  {date: "2024-02-05", name: 'Sandeep', gender: 'Male', quantity: 9200, Age: 42},
  {date: "2024-02-05", name: 'Aarti', gender: 'Female', quantity: 7700, Age: 35},
  {date: "2024-02-05", name: 'Rajiv', gender: 'Male', quantity: 4900, Age: 48},
  {date: "2024-02-05", name: 'Namita', gender: 'Female', quantity: 9300, Age: 50},
  
  {date: "2024-02-15", name: 'Vikas', gender: 'Male', quantity: 6400, Age: 55},
  {date: "2024-02-15", name: 'Sneha', gender: 'Female', quantity: 8200, Age: 32},
  {date: "2024-02-15", name: 'Rohan', gender: 'Male', quantity: 6700, Age: 45},
  {date: "2024-02-15", name: 'Shilpa', gender: 'Female', quantity: 2800, Age: 28},
  {date: "2024-02-15", name: 'Amitav', gender: 'Male', quantity: 8200, Age: 39},
  {date: "2024-02-15", name: 'Jyoti', gender: 'Female', quantity: 9400, Age: 41},
  {date: "2024-02-15", name: 'Sumeet', gender: 'Male', quantity: 4600, Age: 33},
  {date: "2024-02-15", name: 'Kanchan', gender: 'Female', quantity: 7600, Age: 36},
  
  {date: "2024-02-25", name: 'Yogendra', gender: 'Male', quantity: 2500, Age: 40},
  {date: "2024-02-25", name: 'Neha', gender: 'Female', quantity: 9300, Age: 30},
  {date: "2024-02-25", name: 'Rakesh', gender: 'Male', quantity: 7600, Age: 50},
  {date: "2024-02-25", name: 'Rashmi', gender: 'Female', quantity: 8500, Age: 27},
  {date: "2024-02-25", name: 'Sachin', gender: 'Male', quantity: 10000, Age: 48},
  {date: "2024-02-25", name: 'Pooja', gender: 'Female', quantity: 7700, Age: 34},
  {date: "2024-02-25", name: 'Vikram', gender: 'Male', quantity: 1200, Age: 26},
  {date: "2024-02-25", name: 'Swati', gender: 'Female', quantity: 4600, Age: 37},

  // March 2024
  {date: "2024-03-05", name: 'Abhishek', gender: 'Male', quantity: 3000, Age: 31},
  {date: "2024-03-05", name: 'Nalini', gender: 'Female', quantity: 9800, Age: 26},
  {date: "2024-03-05", name: 'Kapil', gender: 'Male', quantity: 7500, Age: 39},
  {date: "2024-03-05", name: 'Rita', gender: 'Female', quantity: 8700, Age: 23},
  {date: "2024-03-05", name: 'Suresh', gender: 'Male', quantity: 9500, Age: 43},
  {date: "2024-03-05", name: 'Aparna', gender: 'Female', quantity: 7900, Age: 36},
  {date: "2024-03-05", name: 'Ravindra', gender: 'Male', quantity: 5100, Age: 49},
  {date: "2024-03-05", name: 'Namrata', gender: 'Female', quantity: 9600, Age: 51},
  
  {date: "2024-03-15", name: 'Vineet', gender: 'Male', quantity: 6800, Age: 56},
  {date: "2024-03-15", name: 'Sangeeta', gender: 'Female', quantity: 8400, Age: 33},
  {date: "2024-03-15", name: 'Rahul', gender: 'Male', quantity: 7000, Age: 46},
  {date: "2024-03-15", name: 'Shweta', gender: 'Female', quantity: 3000, Age: 29},
  {date: "2024-03-15", name: 'Amitabh', gender: 'Male', quantity: 8500, Age: 40},
  {date: "2024-03-15", name: 'Jaya', gender: 'Female', quantity: 9700, Age: 42},
  {date: "2024-03-15", name: 'Sudhir', gender: 'Male', quantity: 4800, Age: 34},
  {date: "2024-03-15", name: 'Kavita', gender: 'Female', quantity: 7800, Age: 37},
  
  {date: "2024-03-25", name: 'Yogesh', gender: 'Male', quantity: 2600, Age: 41},
  {date: "2024-03-25", name: 'Nisha', gender: 'Female', quantity: 9600, Age: 31},
  {date: "2024-03-25", name: 'Rakesh', gender: 'Male', quantity: 7800, Age: 51},
  {date: "2024-03-25", name: 'Rashmi', gender: 'Female', quantity: 8800, Age: 28},
  {date: "2024-03-25", name: 'Sachin', gender: 'Male', quantity: 10300, Age: 49},
  {date: "2024-03-25", name: 'Pooja', gender: 'Female', quantity: 8000, Age: 35},
  {date: "2024-03-25", name: 'Vikram', gender: 'Male', quantity: 1300, Age: 27},
  {date: "2024-03-25", name: 'Swati', gender: 'Female', quantity: 4800, Age: 38},

    // April 2024
  {date: "2024-04-05", name: 'Aditya', gender: 'Male', quantity: 3100, Age: 32},
  {date: "2024-04-05", name: 'Niharika', gender: 'Female', quantity: 9900, Age: 27},
  {date: "2024-04-05", name: 'Karan', gender: 'Male', quantity: 7700, Age: 40},
  {date: "2024-04-05", name: 'Rhea', gender: 'Female', quantity: 8900, Age: 24},
  {date: "2024-04-05", name: 'Siddharth', gender: 'Male', quantity: 9700, Age: 44},
  {date: "2024-04-05", name: 'Aisha', gender: 'Female', quantity: 8100, Age: 37},
  {date: "2024-04-05", name: 'Ravinder', gender: 'Male', quantity: 5300, Age: 50},
  {date: "2024-04-05", name: 'Nalini', gender: 'Female', quantity: 9800, Age: 52},
  
  {date: "2024-04-15", name: 'Vijay', gender: 'Male', quantity: 7000, Age: 57},
  {date: "2024-04-15", name: 'Sonia', gender: 'Female', quantity: 8600, Age: 34},
  {date: "2024-04-15", name: 'Rajesh', gender: 'Male', quantity: 7300, Age: 47},
  {date: "2024-04-15", name: 'Shreya', gender: 'Female', quantity: 3200, Age: 30},
  {date: "2024-04-15", name: 'Amit', gender: 'Male', quantity: 8800, Age: 41},
  {date: "2024-04-15", name: 'Juhi', gender: 'Female', quantity: 10000, Age: 43},
  {date: "2024-04-15", name: 'Sumeet', gender: 'Male', quantity: 5000, Age: 35},
  {date: "2024-04-15", name: 'Kavita', gender: 'Female', quantity: 8000, Age: 39},
  
  {date: "2024-04-25", name: 'Yogesh', gender: 'Male', quantity: 2700, Age: 42},
  {date: "2024-04-25", name: 'Neha', gender: 'Female', quantity: 10000, Age: 32},
  {date: "2024-04-25", name: 'Rakesh', gender: 'Male', quantity: 8100, Age: 52},
  {date: "2024-04-25", name: 'Rashmi', gender: 'Female', quantity: 9100, Age: 29},
  {date: "2024-04-25", name: 'Sachin', gender: 'Male', quantity: 10600, Age: 50},
  {date: "2024-04-25", name: 'Pooja', gender: 'Female', quantity: 8300, Age: 36},
  {date: "2024-04-25", name: 'Vikram', gender: 'Male', quantity: 1400, Age: 28},
  {date: "2024-04-25", name: 'Swati', gender: 'Female', quantity: 5100, Age: 40},
  ];
  

 function  downloadCSV (dataToDownload, fileName) {
if(dataToDownload.length === 0){
  alert("No data to download")
  return
}
 
 const headers = Object.keys(dataToDownload[0]).join(',');
 const csv = [headers, ...dataToDownload.map(row => Object.values(row).join(','))].join('\n');

 const blob = new Blob([csv],  { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement('a');
 if(link.download !== undefined){
   const url = URL.createObjectURL(blob);
   link.setAttribute('href', url);
   link.setAttribute('download', fileName);
   link.style.visibility = 'hidden';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 }
setDownloadMenuVisible(!downloadMenuVisible)

 }


 function toggleDownloadMenu() {
  setDownloadMenuVisible((prevState) => !prevState);
};

  const memoizedAllData = useMemo(() => allData, []);
  useEffect(() => {
    const updateChartData = () => {
      const formattedSelectedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      
      const filteredData = memoizedAllData.filter((item) => item.date === formattedSelectedDate);
  
      if (filteredData.length > 0) {
        setChartData(filteredData);
        setDataAvailable(true);
      } else {
        setChartData([{
          date: formattedSelectedDate,
          name: 'No Data',
          gender: 'N/A',
          quantity: 0,
          Age:'N/A'
        }]);
        setDataAvailable(false);
      }
    };
  
    updateChartData();
  }, [selectedDate, memoizedAllData]);


  function formatXAxis(tickItem) {
    const date = new Date(tickItem);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };



  const memoizedYDomain = useMemo(() => {
    const maxSales = Math.max(...memoizedAllData.map(item => item.sales));
    const maxRevenue = Math.max(...memoizedAllData.map(item => item.revenue));
    const maxCustomers = Math.max(...memoizedAllData.map(item => item.customers));
    const overallMax = Math.max(maxSales, maxRevenue, maxCustomers);
    return [0, Math.ceil(overallMax * 1.1)]; // Add 10% padding to the top
  }, [memoizedAllData]);

  function customTooltip({ active, payload, label }){
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label text-purple-400">{`${payload[0].payload.name}`}</p>
          <p className="intro">{`Age: ${payload[0].payload.Age}`}</p>
          <p className="intro">{`Gender: ${payload[0].payload.gender}`}</p>
          <p className="desc">{`Quantity: ${payload[0].payload.quantity}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div>
      <div className='flex justify-between mb-2'>
              <p>Dual Lines</p>
              <div className='relative'>
                       <button onClick={toggleDownloadMenu} className={`bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${
              !dataAvailable && 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!dataAvailable}  >
                       <FaDownload className="mr-1" size={12} />
                       </button>
                       {downloadMenuVisible && (
        <div className="absolute right-0 mt-2 z-10 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-in-out transform origin-top-right">
          <div className="p-2 space-y-1">
            <button
              onClick={() => downloadCSV(chartData, `dual_lines_report_${selectedDate.toISOString().split('T')[0]}.csv`)  }
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              <PiFileTextThin size={18} className="mr-2 text-blue-600" />
              <span>Extract Chosen Entries</span>
            </button>
            <button
              onClick={() => downloadCSV(memoizedAllData, 'all_data_report.csv')}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            >
              <PiFileTextThin size={18} className="mr-2 text-blue-600" />
              <span>Retrieve Full Data</span>
            </button>
          </div>
        </div>
      )}
              </div>
      </div>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis  dataKey="date"
            tickFormatter={formatXAxis}
            domain={['dataMin', 'dataMax']}
            type="category" />
        <YAxis domain={memoizedYDomain} />
        <Tooltip 
          
          content={customTooltip}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="quantity"
          name="Quantity"
          stroke="#8884d8"
          strokeWidth={3}
          dot={{ r: 6, strokeWidth: 2 }}
          activeDot={{ r: 8 }}
        />
   
      
          
      </LineChart>
    </ResponsiveContainer>
        {!dataAvailable && (
          <div style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
            No data available for{" "}
            {selectedDate.toLocaleString("default", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            .
          </div>
        )}
        </div>
  );
};

export default DualLines;