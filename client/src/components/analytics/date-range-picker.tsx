import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { getDateRangeDescription } from '@/utils/date-utils';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (startDate: Date, endDate: Date) => void;
}

export default function DateRangePicker({ 
  startDate, 
  endDate, 
  onRangeChange 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'custom' | '7d' | '30d' | '90d'>('7d');
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);
  
  const dateRangeText = getDateRangeDescription(startDate, endDate);
  
  const handleRangeSelect = (range: '7d' | '30d' | '90d' | 'custom') => {
    setSelectedRange(range);
    
    if (range === 'custom') {
      // Keep current dates for custom selection
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      return;
    }
    
    const end = new Date();
    const start = new Date();
    
    if (range === '7d') {
      start.setDate(start.getDate() - 6); // Last 7 days (today + 6 previous days)
    } else if (range === '30d') {
      start.setDate(start.getDate() - 29); // Last 30 days
    } else if (range === '90d') {
      start.setDate(start.getDate() - 89); // Last 90 days
    }
    
    setTempStartDate(start);
    setTempEndDate(end);
  };
  
  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onRangeChange(tempStartDate, tempEndDate);
    }
    setIsOpen(false);
  };
  
  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gray-100 hover:bg-gray-200 border-gray-200 text-sm flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <span>{dateRangeText}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={selectedRange === '7d' ? 'default' : 'outline'}
              onClick={() => handleRangeSelect('7d')}
            >
              Last 7 days
            </Button>
            <Button
              size="sm"
              variant={selectedRange === '30d' ? 'default' : 'outline'}
              onClick={() => handleRangeSelect('30d')}
            >
              Last 30 days
            </Button>
            <Button
              size="sm"
              variant={selectedRange === '90d' ? 'default' : 'outline'}
              onClick={() => handleRangeSelect('90d')}
            >
              Last 90 days
            </Button>
            <Button
              size="sm"
              variant={selectedRange === 'custom' ? 'default' : 'outline'}
              onClick={() => handleRangeSelect('custom')}
            >
              Custom
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Start Date</div>
              <Calendar
                mode="single"
                selected={tempStartDate}
                onSelect={setTempStartDate}
                initialFocus
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">End Date</div>
              <Calendar
                mode="single"
                selected={tempEndDate}
                onSelect={setTempEndDate}
                initialFocus
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
