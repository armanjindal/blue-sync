'use client'
import Image from 'next/image'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

import { useEffect, useState } from "react";

//TODO: Change this later to make fewer db calls
import { createClient } from '@/lib/supabase/client';


export default function EventCard({
    features,
})
{
    const [imageURL, setImageURL] = useState(null);
    const resultId = features.id; // Assuming resultId is fixed or coming from somewhere in your application
    
    const supabase = createClient()
    useEffect(() => {
      async function fetchData() {
        // Construct your query
        const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('result_id', resultId)
  
        if (error) {
          console.error('Error fetching data:', error.message);
        } else {
          setImageURL(data);
        }
      }
  
      fetchData();
    }, [resultId]);

    console.log(imageURL)
    return (
    <div>
    <Card className="gap-y-2">
    <CardHeader>
        <CardTitle>{features.title}</CardTitle>
    </CardHeader>
    <CardContent>
    <CardDescription className="max-w-lg h-32 overflow-y-auto border-solid border-2 border-sky-500">
        {features.description}
    </CardDescription>
    <Carousel>
        <CarouselContent>
    {imageURL && imageURL.map(result => (
          <CarouselItem key={result.id}><img key={result.id} width={result.naturalWidth} height={result.naturalHeight} src={result.url} alt="Image" /></CarouselItem>
    ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    </Carousel>
        <p>Starts at {features.start_date}</p>
        <p>Ends at {features.end_date}</p>
    </CardContent>
    <CardFooter>
        <p>Source Link & More Details: <a href={features.url}>{features.url}</a></p>
    </CardFooter>
    </Card>
    </div>
)
} 