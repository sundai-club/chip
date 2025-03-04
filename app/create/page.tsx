'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	ImageIcon,
	X,
	Search,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function CreateTaskPage() {
	const [step, setStep] = useState(1);
	const [date, setDate] = useState<Date>();
	const [selectedGif, setSelectedGif] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState('');
	const [giphyResults, setGiphyResults] = useState<
		Array<{ id: string; url: string }>
	>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [taskCategory, setTaskCategory] = useState('event');
	const [taskGoalAmount, setTaskGoalAmount] = useState('');
	const [taskSuggestedPledge, setTaskSuggestedPledge] = useState('');
	const [taskPrivacy, setTaskPrivacy] = useState('friends');

	const { user } = useAuth();
	const router = useRouter();

	const nextStep = () => {
		if (step < 5) setStep(step + 1);
	};

	const prevStep = () => {
		if (step > 1) setStep(step - 1);
	};

	const searchGiphy = async (query: string) => {
		setIsSearching(true);
		try {
			console.log(`Searching for: ${query}`);
			const response = await fetch(
				`/api/giphy?q=${encodeURIComponent(query)}`
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data = await response.json();
			console.log('Giphy search results:', data);

			if (!data.data || !Array.isArray(data.data)) {
				console.error('Unexpected response format:', data);
				setGiphyResults([]);
			} else {
				setGiphyResults(
					data.data.map((gif: any) => ({
						id: gif.id,
						url: gif.images.fixed_height.url,
						title: gif.title,
					}))
				);
			}
		} catch (error) {
			console.error('Error searching gifs:', error);
			setGiphyResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const removeGif = () => {
		setSelectedGif('');
		setGiphyResults([]);
		setSearchQuery('');
	};

	const fetchDefaultGifs = async () => {
		if (giphyResults.length === 0 && !isSearching) {
			setIsSearching(true);
			try {
				const searchTerm = 'organizer';

				const response = await fetch(
					`/api/giphy?q=${encodeURIComponent(searchTerm)}`
				);
				const data = await response.json();

				if (data.data && Array.isArray(data.data)) {
					const results = data.data.map((gif: any) => ({
						id: gif.id,
						url: gif.images.fixed_height.url,
					}));

					setGiphyResults(results);
				}
			} catch (error) {
				console.error('Error fetching default GIFs:', error);
			} finally {
				setIsSearching(false);
			}
		}
	};

	useEffect(() => {
		if (step === 1 && !selectedGif) {
			fetchDefaultGifs();
		}
	}, [step]);

	useEffect(() => {
		if (giphyResults.length > 0 && typeof window !== 'undefined') {
			// Try to load the image directly - only in browser
			try {
				const img = new (window.Image as any)();
				img.src = giphyResults[0].url;
			} catch (error) {
				console.error('Error creating image:', error);
			}
		}
	}, [giphyResults]);

	const submitTask = async () => {
		if (!user) {
			console.error('User not authenticated');
			return;
		}

		try {
			// Add logging to debug
			console.log('Creating task with data:', {
				title: taskTitle,
				description: taskDescription,
				due_date: date ? date.toISOString().split('T')[0] : null,
				category: taskCategory,
				goal_amount: parseFloat(taskGoalAmount),
				privacy: taskPrivacy,
				image_url: selectedGif,
				created_by: user.id,
				contributors: 0,
			});

			const { data, error } = await supabase
				.from('tasks')
				.insert({
					title: taskTitle,
					description: taskDescription,
					due_date: date ? date.toISOString().split('T')[0] : null,
					category: taskCategory,
					goal_amount: parseFloat(taskGoalAmount),
					privacy: taskPrivacy,
					image_url: selectedGif,
					created_by: user.id,
					contributors: 0,
				})
				.select();

			if (error) {
				console.error('Supabase error:', error);
				throw new Error('Failed to create task');
			}

			console.log('Task created successfully:', data);
			router.push('/');
		} catch (error) {
			console.error('Error creating task:', error);
			// Show error message to user
			alert('Failed to create task. Please try again.');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500">
			<header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b">
				<div className="container flex items-center justify-between h-16 px-4 mx-auto">
					<div className="flex items-center gap-2">
						<Link href="/">
							<h1 className="text-xl font-bold text-[#3D1766]">
								TaskShare
							</h1>
						</Link>
					</div>
					<div className="flex items-center gap-4">
						<div className="w-8 h-8 rounded-full bg-[#3D1766] text-white flex items-center justify-center">
							JS
						</div>
					</div>
				</div>
			</header>

			<main className="container px-4 py-6 mx-auto">
				<div className="max-w-2xl mx-auto">
					<div className="mb-6">
						<Link href="/" className="text-white hover:underline">
							← Back to tasks
						</Link>
					</div>

					<Card className="bg-white/95 backdrop-blur-sm shadow-lg">
						<CardHeader>
							<h1 className="text-2xl font-bold">
								Create a New Task
							</h1>
							<div className="flex items-center justify-between mt-4">
								<StepIndicator
									currentStep={step}
									totalSteps={5}
								/>
							</div>
						</CardHeader>
						<CardContent>
							{step === 1 && (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">
										Basic Information
									</h2>
									<div className="space-y-2">
										<Label htmlFor="title">
											Task Title
										</Label>
										<Input
											id="title"
											placeholder="Enter a clear, descriptive title"
											value={taskTitle}
											onChange={(e) =>
												setTaskTitle(e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="description">
											Description
										</Label>
										<Textarea
											id="description"
											placeholder="Describe what needs to be done in detail"
											rows={4}
											value={taskDescription}
											onChange={(e) =>
												setTaskDescription(
													e.target.value
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="category">
											Category
										</Label>
										<Select
											value={taskCategory}
											onChange={(value) =>
												setTaskCategory(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="event">
													Event
												</SelectItem>
												<SelectItem value="transportation">
													Transportation
												</SelectItem>
												<SelectItem value="food">
													Food
												</SelectItem>
												<SelectItem value="shopping">
													Shopping
												</SelectItem>
												<SelectItem value="entertainment">
													Entertainment
												</SelectItem>
												<SelectItem value="other">
													Other
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>Task GIF</Label>
										<div className="flex flex-col gap-4">
											{selectedGif ? (
												<div className="relative">
													<Image
														src={selectedGif}
														alt="Task GIF"
														width={400}
														height={300}
														className="w-full h-[200px] object-cover rounded-lg"
														onError={() =>
															console.error(
																'Error loading selected GIF'
															)
														}
													/>
													<Button
														variant="destructive"
														size="icon"
														className="absolute top-2 right-2"
														onClick={removeGif}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											) : (
												<div className="space-y-4">
													<div className="flex gap-2">
														<Input
															placeholder="Search for a GIF..."
															value={searchQuery}
															onChange={(e) =>
																setSearchQuery(
																	e.target
																		.value
																)
															}
															onKeyDown={(e) => {
																if (
																	e.key ===
																	'Enter'
																) {
																	e.preventDefault();
																	searchGiphy(
																		searchQuery
																	);
																}
															}}
														/>
														<Button
															onClick={() =>
																searchGiphy(
																	searchQuery
																)
															}
															disabled={
																isSearching
															}
														>
															<Search className="h-4 w-4" />
														</Button>
													</div>
													{isSearching ? (
														<div className="text-center py-4">
															Searching...
														</div>
													) : giphyResults.length >
													  0 ? (
														<div className="grid grid-cols-3 gap-2">
															{giphyResults.map(
																(gif) => (
																	<div
																		key={
																			gif.id
																		}
																		className="cursor-pointer hover:opacity-80 border border-gray-200 rounded-lg overflow-hidden"
																		onClick={() => {
																			console.log(
																				'Selecting GIF:',
																				gif.url
																			);
																			setSelectedGif(
																				gif.url
																			);
																		}}
																	>
																		<img
																			src={
																				gif.url
																			}
																			alt="GIF search result"
																			className="w-full h-[100px] object-cover rounded-lg"
																		/>
																	</div>
																)
															)}
														</div>
													) : (
														<div className="text-center py-4 text-gray-500">
															{searchQuery
																? 'No results found'
																: 'Loading suggested GIFs...'}
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{step === 2 && (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">
										Timeline
									</h2>
									<div className="space-y-2">
										<Label>Due Date</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{date ? (
														format(date, 'PPP')
													) : (
														<span>
															Select a date
														</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={date}
													onSelect={setDate}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="space-y-2">
										<Label htmlFor="estimatedTime">
											Estimated Completion Time (hours)
										</Label>
										<Input
											id="estimatedTime"
											type="number"
											min="0.5"
											step="0.5"
											placeholder="e.g., 2.5"
										/>
									</div>
								</div>
							)}

							{step === 3 && (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">
										Financial Details
									</h2>
									<div className="space-y-2">
										<Label htmlFor="goalAmount">
											Minimum Pledge Goal ($)
										</Label>
										<Input
											id="goalAmount"
											type="number"
											min="1"
											placeholder="e.g., 100"
											value={taskGoalAmount}
											onChange={(e) =>
												setTaskGoalAmount(
													e.target.value
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="suggestedPledge">
											Suggested Individual Pledge Amount
											($)
										</Label>
										<Input
											id="suggestedPledge"
											type="number"
											min="1"
											placeholder="e.g., 20"
											value={taskSuggestedPledge}
											onChange={(e) =>
												setTaskSuggestedPledge(
													e.target.value
												)
											}
										/>
									</div>
									<div className="p-4 bg-gray-50 rounded-lg">
										<p className="text-sm text-gray-600">
											Setting a reasonable goal increases
											the chances of your task being
											funded. The suggested individual
											pledge helps contributors know how
											much to contribute.
										</p>
									</div>
								</div>
							)}

							{step === 4 && (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">
										Privacy Settings
									</h2>
									<div className="space-y-4">
										<div className="flex items-start space-x-3">
											<input
												type="radio"
												id="privacy-friends"
												name="privacy"
												className="mt-1"
												defaultChecked
												onChange={(e) =>
													setTaskPrivacy(
														e.target.id.replace(
															'privacy-',
															''
														)
													)
												}
											/>
											<div>
												<Label
													htmlFor="privacy-friends"
													className="font-medium"
												>
													Friends Only
												</Label>
												<p className="text-sm text-gray-500">
													Only your friends can see
													and contribute to this task
												</p>
											</div>
										</div>
										<div className="flex items-start space-x-3">
											<input
												type="radio"
												id="privacy-network"
												name="privacy"
												className="mt-1"
												onChange={(e) =>
													setTaskPrivacy(
														e.target.id.replace(
															'privacy-',
															''
														)
													)
												}
											/>
											<div>
												<Label
													htmlFor="privacy-network"
													className="font-medium"
												>
													Network
												</Label>
												<p className="text-sm text-gray-500">
													Friends of friends can also
													see and contribute
												</p>
											</div>
										</div>
										<div className="flex items-start space-x-3">
											<input
												type="radio"
												id="privacy-public"
												name="privacy"
												className="mt-1"
												onChange={(e) =>
													setTaskPrivacy(
														e.target.id.replace(
															'privacy-',
															''
														)
													)
												}
											/>
											<div>
												<Label
													htmlFor="privacy-public"
													className="font-medium"
												>
													Public
												</Label>
												<p className="text-sm text-gray-500">
													Anyone on TaskShare can see
													and contribute
												</p>
											</div>
										</div>
									</div>
								</div>
							)}

							{step === 5 && (
								<div className="space-y-4">
									<h2 className="text-lg font-semibold">
										Review and Submit
									</h2>
									<div className="space-y-4">
										{selectedGif && (
											<div className="w-full">
												<Image
													src={selectedGif}
													alt="Task GIF"
													width={400}
													height={300}
													className="w-full h-[200px] object-cover rounded-lg"
													onError={() =>
														console.error(
															'Error loading selected GIF'
														)
													}
												/>
											</div>
										)}
										<div className="p-4 bg-gray-50 rounded-lg space-y-3">
											<div>
												<span className="font-medium">
													Title:
												</span>{' '}
												{taskTitle}
											</div>
											<div>
												<span className="font-medium">
													Category:
												</span>{' '}
												{taskCategory}
											</div>
											<div>
												<span className="font-medium">
													Due Date:
												</span>{' '}
												{date
													? format(date, 'PPP')
													: 'Not set'}
											</div>
											<div>
												<span className="font-medium">
													Pledge Goal:
												</span>{' '}
												${taskGoalAmount}
											</div>
											<div>
												<span className="font-medium">
													Suggested Pledge:
												</span>{' '}
												${taskSuggestedPledge}
											</div>
											<div>
												<span className="font-medium">
													Privacy:
												</span>{' '}
												{taskPrivacy}
											</div>
											<div>
												<span className="font-medium">
													Description:
												</span>
												<p className="text-sm text-gray-600 mt-1">
													{taskDescription}
												</p>
											</div>
										</div>
									</div>
									<div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
										<p className="text-sm text-yellow-800">
											By submitting this task, you agree
											to our Terms of Service and
											understand that TaskShare will hold
											pledged funds in escrow until the
											task is completed.
										</p>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-between">
							{step > 1 ? (
								<Button variant="outline" onClick={prevStep}>
									<ChevronLeft className="w-4 h-4 mr-2" />
									Back
								</Button>
							) : (
								<Link href="/">
									<Button variant="outline">Cancel</Button>
								</Link>
							)}

							{step < 5 ? (
								<Button
									onClick={nextStep}
									className="bg-[#7B2869] hover:bg-[#3D1766]"
								>
									Next
									<ChevronRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Button
									onClick={submitTask}
									className="bg-[#7B2869] hover:bg-[#3D1766] w-full"
								>
									Create Task
								</Button>
							)}
						</CardFooter>
					</Card>
				</div>
			</main>
		</div>
	);
}

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
	return (
		<div className="flex items-center w-full gap-2">
			{Array.from({ length: totalSteps }).map((_, index) => (
				<div
					key={index}
					className={`h-2 rounded-full flex-1 ${
						index + 1 <= currentStep
							? 'bg-[#7B2869]'
							: 'bg-gray-200'
					}`}
				/>
			))}
		</div>
	);
}
