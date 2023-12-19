import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const Contact: React.FC = () => {
    return (
        <section className="py-12 px-4">
            <h2 className="text-3xl font-bold text-center">Contact</h2>
            <Card className="mx-auto mt-6 w-3/4 lg:w-1/2">
                <CardHeader>
                    <CardTitle>Let&apos;s Chat</CardTitle>
                    <CardDescription>Interested in working together? Fill out the form below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Enter your email" type="email" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea className="min-h-[100px]" id="message" placeholder="Enter your message" minLength={10} maxLength={25_000} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>*not integrated yet*</Button>
                </CardFooter>
            </Card>
        </section>
    );
};

export default Contact;
