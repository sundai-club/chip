import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ProgressBar, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { format } from 'date-fns';
import Header from '../shared/components/Header';
import { apiClient } from '../shared/services/api';
import axios from 'axios';

interface Task {
    title: string;
    description: string;
    category: string;
    dueDate: Date | null;
    estimatedTime: number;
    goalAmount: number;
    suggestedPledge: number;
    privacy: 'friends' | 'network' | 'public';
    gifUrl: string;
}

interface GiphyResult {
    id: string;
    url: string;
}

const CreateTaskPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedGif, setSelectedGif] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [giphyResults, setGiphyResults] = useState<GiphyResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const [task, setTask] = useState<Task>({
        title: '',
        description: '',
        category: '',
        dueDate: null,
        estimatedTime: 0,
        goalAmount: 0,
        suggestedPledge: 0,
        privacy: 'friends',
        gifUrl: ''
    });

    const nextStep = () => {
        if (step < 5) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            const taskData = {
                title: task.title,
                description: task.description,
                category: task.category,
                goal: task.goalAmount,
                due_date: task.dueDate?.toISOString(),
                estimated_time: task.estimatedTime,
                suggested_pledge: task.suggestedPledge,
                image_url: selectedGif
            };

            const response = await apiClient.post('/api/chip/tasks/', taskData);
            // Task created successfully
            navigate('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error creating task:', error.response?.data);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    const searchGiphy = async (query: string) => {
        if (!query) {
            setGiphyResults([]);
            return;
        }
        setIsSearching(true);

        try {
            const response = await apiClient.get<GiphyResult[]>('/api/chip/gifs/', {
                params: { q: query }
            });
            // Response data is already parsed JSON, contains Array<{ id: string; url: string }>
            setGiphyResults(response.data || []);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error searching GIFs:', error.response?.data);
            } else {
                console.error('Unexpected error:', error);
            }
            setGiphyResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h4>Basic Information</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a clear, descriptive title"
                                value={task.title}
                                onChange={(e) => setTask({ ...task, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Describe what needs to be done in detail"
                                value={task.description}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={task.category}
                                onChange={(e) => setTask({ ...task, category: e.target.value })}
                            >
                                <option value="">Select a category</option>
                                <option value="event">Event</option>
                                <option value="transportation">Transportation</option>
                                <option value="food">Food</option>
                                <option value="shopping">Shopping</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Task Image</Form.Label>
                            <div className="d-flex gap-2 mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for a GIF..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            searchGiphy(searchQuery);
                                        }
                                    }}
                                />
                                <Button 
                                    onClick={() => searchGiphy(searchQuery)} 
                                    disabled={isSearching}
                                    variant="primary"
                                >
                                    <Search size={16} />
                                </Button>
                            </div>
                            {selectedGif && (
                                <div className="position-relative mb-3">
                                    <Image src={selectedGif} alt="Selected GIF" fluid className="rounded" style={{ maxHeight: '200px' }} />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-2"
                                        onClick={() => setSelectedGif('')}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            )}
                            {isSearching && (
                                <div className="text-center my-3">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Searching for GIFs...
                                </div>
                            )}
                            {giphyResults.length > 0 && (
                                <div className="gif-results mt-3">
                                    <Row xs={2} md={3} className="g-2">
                                        {giphyResults.map((gif) => (
                                            <Col key={gif.id}>
                                                <div 
                                                    className="position-relative" 
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedGif(gif.url)}
                                                >
                                                    <Image
                                                        src={gif.url}
                                                        alt="GIF option"
                                                        fluid
                                                        className="rounded hover-shadow"
                                                        style={{
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            transition: 'transform 0.2s',
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                            {searchQuery && giphyResults.length === 0 && !isSearching && (
                                <div className="text-center text-muted my-3">
                                    No GIFs found. Try a different search term.
                                </div>
                            )}
                        </Form.Group>
                    </>
                );

            case 2:
                return (
                    <>
                        <h4>Timeline</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={task.dueDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setTask({ ...task, dueDate: new Date(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Estimated Completion Time (hours)</Form.Label>
                            <Form.Control
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={task.estimatedTime}
                                onChange={(e) => setTask({ ...task, estimatedTime: parseFloat(e.target.value) })}
                            />
                        </Form.Group>
                    </>
                );

            case 3:
                return (
                    <>
                        <h4>Financial Details</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Minimum Pledge Goal ($)</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={task.goalAmount}
                                onChange={(e) => setTask({ ...task, goalAmount: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Suggested Individual Pledge Amount ($)</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={task.suggestedPledge}
                                onChange={(e) => setTask({ ...task, suggestedPledge: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                    </>
                );

            case 4:
                return (
                    <>
                        <h4>Privacy Settings</h4>
                        <Form.Group className="mb-3">
                            {['friends', 'network', 'public'].map((option) => (
                                <Form.Check
                                    key={option}
                                    type="radio"
                                    name="privacy"
                                    id={`privacy-${option}`}
                                    label={option.charAt(0).toUpperCase() + option.slice(1)}
                                    checked={task.privacy === option}
                                    onChange={() => setTask({ ...task, privacy: option as Task['privacy'] })}
                                />
                            ))}
                        </Form.Group>
                    </>
                );

            case 5:
                return (
                    <>
                        <h4>Review and Submit</h4>
                        <Card className="mb-3">
                            <Card.Body>
                                <dl>
                                    <dt>Title</dt>
                                    <dd>{task.title}</dd>
                                    <dt>Category</dt>
                                    <dd>{task.category}</dd>
                                    <dt>Due Date</dt>
                                    <dd>{task.dueDate ? format(task.dueDate, 'PPP') : 'Not set'}</dd>
                                    <dt>Goal Amount</dt>
                                    <dd>${task.goalAmount}</dd>
                                    <dt>Privacy</dt>
                                    <dd>{task.privacy}</dd>
                                    <dt>Description</dt>
                                    <dd>{task.description}</dd>
                                </dl>
                            </Card.Body>
                        </Card>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <Header first_name="" last_name="" email="" balance={0} projectId="" />
            <Container className="py-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="mb-3">
                            <Link to="/" className="text-decoration-none">← Back to tasks</Link>
                        </div>

                        <Card>
                            <Card.Header>
                                <h3 className="mb-3">Create a New Task</h3>
                                <ProgressBar now={(step / 5) * 100} />
                            </Card.Header>
                            <Card.Body>{renderStepContent()}</Card.Body>
                            <Card.Footer className="d-flex justify-content-between">
                                {step > 1 ? (
                                    <Button variant="outline-secondary" onClick={prevStep}>
                                        Back
                                    </Button>
                                ) : (
                                    <Link to="/">
                                        <Button variant="outline-secondary">Cancel</Button>
                                    </Link>
                                )}

                                {step < 5 ? (
                                    <Button variant="primary" onClick={nextStep}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Create Task
                                    </Button>
                                )}
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreateTaskPage; 