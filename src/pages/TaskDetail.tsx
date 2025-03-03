import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ProgressBar, Image, Badge, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, DollarSign, Share2, Users } from 'lucide-react';
import Header from '../shared/components/Header';
import { apiClient } from '../shared/services/api';
import * as dateUtils from '../utils/date';

interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string;
    goal: number;
    status: string;
    category: string;
    image_url: string;
    statistics: {
        total_pledged: number;
        contributor_count: number;
        days_remaining: number;
        completion_percentage: number;
    };
}

interface Contribution {
    id: number;
    user: {
        id: number;
        email: string;
    };
    user_name: string;
    amount: number;
    created_at: string;
    comment: string;
}

const TaskDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTask = async () => {
            if (!id) {
                setError('No task ID provided');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('Fetching task with ID:', id);
                const response = await apiClient.get(`/api/chip/tasks/${id}/`);
                console.log('Task response:', response);
                setTask(response);
                
                // Load contributions
                const contributionsResponse = await apiClient.get(`/api/chip/tasks/${id}/contributions/`);
                console.log('Contributions response:', contributionsResponse);
                setContributions(contributionsResponse);
            } catch (error) {
                console.error('Error loading task:', error);
                setError('Failed to load task details. Please try again.');
                // Don't navigate away automatically, let the user see the error
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [id, navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-vh-100 bg-light">
                <Header first_name="" last_name="" email="" balance={0} projectId="" />
                <Container className="py-4">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading task details...</p>
                    </div>
                </Container>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-vh-100 bg-light">
                <Header first_name="" last_name="" email="" balance={0} projectId="" />
                <Container className="py-4">
                    <Alert variant="danger">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>{error}</p>
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-danger" onClick={() => navigate('/')}>
                                Return to Home
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </div>
        );
    }

    // Show not found state
    if (!task) {
        return (
            <div className="min-vh-100 bg-light">
                <Header first_name="" last_name="" email="" balance={0} projectId="" />
                <Container className="py-4">
                    <Alert variant="warning">
                        <Alert.Heading>Task Not Found</Alert.Heading>
                        <p>The task you're looking for doesn't exist or has been removed.</p>
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-warning" onClick={() => navigate('/')}>
                                Return to Home
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </div>
        );
    }

    const handlePledge = async (amount: number) => {
        try {
            await apiClient.post(`/api/chip/tasks/${id}/contribute/`, { amount });
            // Refresh task and contributions data
            const [taskResponse, contributionsResponse] = await Promise.all([
                apiClient.get(`/api/chip/tasks/${id}/`),
                apiClient.get(`/api/chip/tasks/${id}/contributions/`)
            ]);
            setTask(taskResponse);
            setContributions(contributionsResponse);
        } catch (error) {
            console.error('Error pledging:', error);
            setError('Failed to make pledge. Please try again.');
        }
    };

    const handleAcceptTask = async () => {
        try {
            await apiClient.post(`/api/chip/tasks/${id}/update_status/`, {
                status: 'Accepted'
            });
            const task = await apiClient.get(`/api/chip/tasks/${id}/`);
            setTask(task);
        } catch (error) {
            console.error('Error accepting task:', error);
            setError('Failed to accept task. Please try again.');
        }
    };

    const handleShare = async () => {
        try {
            const response = await apiClient.post(`/api/chip/tasks/${id}/share/`, {
                platform: 'web',
                message: 'Check out this task!'
            });
            if (response.share_url) {
                window.open(response.share_url, '_blank');
            }
        } catch (error) {
            console.error('Error sharing task:', error);
            setError('Failed to share task. Please try again.');
        }
    };

    if (!task) return null;

    return (
        <div className="min-vh-100 bg-light">
            <Header first_name="" last_name="" email="" balance={0} projectId="" />
            
            <Container className="py-4">
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <div className="mb-4">
                    <Link to="/" className="text-decoration-none text-primary">
                        ← Back to tasks
                    </Link>
                </div>

                <Card className="shadow">
                    <Card.Body className="p-4">
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-start">
                                <h1 className="h2">{task.title}</h1>
                                <StatusBadge status={task.status} />
                            </div>
                            
                            <div className="mt-4 mb-3">
                                <Image
                                    src={task.image_url}
                                    alt={task.title}
                                    className="w-100 rounded"
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                            </div>

                            <div className="d-flex flex-wrap gap-4 mt-3">
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Calendar size={16} />
                                    <span>Due: {dateUtils.formatDate(task.due_date)}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Clock size={16} />
                                    <span>
                                        {task.statistics.days_remaining > 0 
                                            ? `${task.statistics.days_remaining} days left` 
                                            : task.statistics.days_remaining === 0 
                                                ? "Due today"
                                                : "Past due"}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Users size={16} />
                                    <span>{task.statistics.contributor_count} contributors</span>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="mb-4">
                            <h2 className="h4 mb-3">Description</h2>
                            <p className="text-muted">{task.description}</p>
                        </div>

                        <hr />

                        <div className="mb-4">
                            <h2 className="h4 mb-3">Pledge Progress</h2>
                            <Card className="bg-light">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Current pledges</span>
                                        <span className="h4 mb-0">
                                            ${task.statistics.total_pledged} of ${task.goal}
                                        </span>
                                    </div>
                                    <ProgressBar 
                                        now={task.statistics.completion_percentage} 
                                        className="mb-3"
                                        style={{ height: '0.75rem' }}
                                    />
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">{task.statistics.contributor_count} contributors</small>
                                        <small className="text-muted">{task.statistics.completion_percentage.toFixed(0)}% of goal</small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        {contributions.length > 0 && (
                            <>
                                <hr />
                                <div className="mb-4">
                                    <h2 className="h4 mb-3">Contributors</h2>
                                    {contributions.map((contribution) => (
                                        <Card key={contribution.id} className="mb-2">
                                            <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div 
                                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                        style={{ width: '32px', height: '32px' }}
                                                    >
                                                        {contribution.user_name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span>{contribution.user_name}</span>
                                                </div>
                                                <span className="fw-bold">${contribution.amount}</span>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}

                        <Row className="g-3">
                            {(task.status === "New" || task.status === "Pledged") ? (
                                <>
                                    <Col sm={6}>
                                        <Button 
                                            variant="primary" 
                                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            onClick={() => handlePledge(10)} // You might want to add a modal for amount input
                                        >
                                            <DollarSign size={16} />
                                            Pledge Money
                                        </Button>
                                    </Col>
                                    <Col sm={6}>
                                        <Button 
                                            variant="outline-primary" 
                                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handleAcceptTask}
                                        >
                                            <CheckCircle size={16} />
                                            Accept Task
                                        </Button>
                                    </Col>
                                </>
                            ) : task.status === "Accepted" ? (
                                <>
                                    <Col sm={6}>
                                        <Button variant="secondary" disabled className="w-100">
                                            Task Accepted
                                        </Button>
                                    </Col>
                                    <Col sm={6}>
                                        <Button 
                                            variant="outline-primary" 
                                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handleShare}
                                        >
                                            <Share2 size={16} />
                                            Share
                                        </Button>
                                    </Col>
                                </>
                            ) : (
                                <Col xs={12}>
                                    <Button 
                                        variant="outline-primary" 
                                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                                        onClick={handleShare}
                                    >
                                        <Share2 size={16} />
                                        Share
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

function StatusBadge({ status }: { status: string }) {
    const getVariant = () => {
        switch (status) {
            case "New": return "primary";
            case "Pledged": return "info";
            case "Accepted": return "warning";
            case "Completed": return "success";
            case "Closed": return "danger";
            default: return "secondary";
        }
    };

    return (
        <Badge 
            bg={getVariant()} 
            style={status === "New" ? {
                backgroundColor: '#e7f1ff',
                color: '#0d6efd',
                border: '1px solid #0d6efd',
                fontWeight: 'bold'
            } : undefined}
        >
            {status}
        </Badge>
    );
}

export default TaskDetailPage; 