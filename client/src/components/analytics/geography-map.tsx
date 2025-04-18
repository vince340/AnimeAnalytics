import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountryData } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface GeographyMapProps {
  data?: CountryData[];
  isLoading: boolean;
}

// Map of country names to flag emojis
const countryFlags: Record<string, string> = {
  'United States': '🇺🇸',
  'Japan': '🇯🇵',
  'United Kingdom': '🇬🇧',
  'Canada': '🇨🇦',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Brazil': '🇧🇷',
  'India': '🇮🇳',
  'South Korea': '🇰🇷',
  'China': '🇨🇳',
  'Russia': '🇷🇺',
  'Mexico': '🇲🇽',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭'
};

export default function GeographyMap({ data, isLoading }: GeographyMapProps) {
  // Limit display to top countries
  const topCountries = data?.slice(0, 6) || [];

  // Helper to get flag emoji for a country
  const getCountryFlag = (country: string): string => {
    return countryFlags[country] || '🌍';
  };

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-semibold">Visitor Geography</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-80 relative bg-gray-100 rounded-lg mb-4 overflow-hidden">
          {/* We'd implement a real map here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 1024 512"
              className="h-full w-full object-cover opacity-25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M610.5 423.3c-8.8-12-23.9-18.1-39.2-15.2-15.3 2.9-28 14.2-32.8 29.2-4.8 14.9-1.4 31.2 8.9 42.4 10.3 11.2 26.2 15.2 40.9 10.3 14.7-4.9 25.6-17.6 28.2-32.7 2.5-15.1-2.9-30.3-16.5-39.2 3.6 1.4 7.2 2.8 10.7 4.3-2.2-4.9-4.3-9.9-6.5-14.8-2.2-5-5.8-9.1-10.7-4.3 7.8 8 15.5 15.9 23.3 23.9 5.8 6 13.9-3.1 8-9.1-7.8-8-15.5-15.9-23.3-23.9-3.9-4-11.4-2.7-10.7 4.3 2.2 4.9 4.3 9.9 6.5 14.8 2.2 5 5.8 9.1 10.7 4.3-13.4-8.9-27.4-13.8-43.1-11.7-15.7 2.1-29.9 11.4-37.7 24.8-7.8 13.4-9.1 30.5-2.6 44.7 6.5 14.2 20.5 23.9 36.1 24.8 15.6.9 31.2-6.7 40.1-19.8 8.9-13.1 9.9-31 2.7-45.4-7.2-14.4-23.1-23.1-38.6-21 5.2 1 10.3 2 15.5 3.1-2.2-14.7-4.5-29.5-6.7-44.2-.7-4.6-8.3-4.6-9 0 2.2 14.7 4.5 29.5 6.7 44.2 1 6.9 11.5 5.9 10.3-1M180.9 171.3c35.2 8.1 71.8 9.3 107.3 1.1 4.9-1.1 3.5-8.3-1.4-7.2-33.8 7.8-68.5 6.7-102.1-.8-4.9-1.1-8.8 5.8-3.8 6.9M308.1 121.6c60.6 38.8 108.6 92.8 142.5 156.9 2.5 4.7 9.8 0 7.2-4.7-34.5-65.1-83.4-120.1-145.2-159.5-4.3-2.8-8.9 4.5-4.5 7.3M260.9 344.6c19 32.1 35.4 65.6 49.1 100.2 1.9 4.8 9.1 1.2 7.2-3.6-13.9-35.1-30.5-69.2-49.8-101.8-2.7-4.5-9 .8-6.5 5.2M549.9 400.4c-14.5-35.2-27.4-71.2-38.7-107.7-1.6-5.2-8.9-2.1-7.2 3.1 11.4 36.9 24.5 73.2 39.1 108.8 2.1 5.1 8.9 .9 6.8-4.2M726 186c-29.5 62.5-61.3 126.1-77.2 193.6-1.2 5.2 6 8.4 7.2 3.1 15.7-66.8 47.3-129.9 76.5-191.9 2.2-4.7-4.4-9.5-6.5-4.8M408.2 70.4c26.7 9.3 52.8 20.6 78.2 33.6 4.5 2.3 8.5-4.5 4-6.8-25.8-13.2-52.3-24.7-79.4-34.1-4.8-1.7-7.6 5.6-2.8 7.3"
                fill="#4A90E2"
              />
            </svg>
            {/* Dots representing visitors on the map */}
            {topCountries.map((country, i) => (
              <div
                key={country.name}
                className="absolute w-3 h-3 bg-primary rounded-full animate-ping"
                style={{
                  top: `${30 + (i * 10)}%`,
                  left: `${40 + (i * 8)}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))
          ) : topCountries.length > 0 ? (
            topCountries.map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                    <span className="text-xs">{getCountryFlag(country.name)}</span>
                  </div>
                  <span className="text-sm">{country.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{country.visitors.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1">{country.percentage}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No geography data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
