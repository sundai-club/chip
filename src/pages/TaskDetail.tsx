import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, ProgressBar, Image, Badge } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, DollarSign, Share2, Users } from 'lucide-react';
import Header from '../shared/components/Header';
import { apiClient } from '../shared/services/api';

// Types from your existing Task interface
interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    pledgeAmount: number;
    goalAmount: number;
    status: 'New' | 'Pledged' | 'Accepted' | 'Completed' | 'Closed';
    contributors: number;
    category: string;
    imageUrl: string;
}

interface Contributor {
    id: number;
    name: string;
    initials: string;
    amount: number;
}

const TaskDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTask = async () => {
            try {
                const taskData = await apiClient.get(`/api/chip/tasks/${id}/`);
                setTask(taskData);
            } catch (error) {
                console.error('Error loading task:', error);
                navigate('/');
            }
        };

        loadTask();
    }, [id, navigate]);

    const handlePledge = async (amount: number) => {
        try {
            await apiClient.post(`/api/chip/tasks/${id}/contribute/`, { amount });
            const updatedTask = await apiClient.get(`/api/chip/tasks/${id}/`);
            setTask(updatedTask);
        } catch (error) {
            console.error('Error pledging:', error);
        }
    };

    const handleAcceptTask = async () => {
        try {
            await apiClient.post(`/api/chip/tasks/${id}/update_status/`, {
                status: 'accepted'
            });
            const response = await apiClient.get(`/api/chip/tasks/${id}/`);
            setTask(response.data);
        } catch (error) {
            console.error('Error accepting task:', error);
        }
    };

    const handleShare = async () => {
        try {
            const shareResult = await apiClient.post(`/api/chip/tasks/${id}/share/`, {
                platform: 'web',
                message: 'Check out this task!'
            });
            window.open(shareResult.share_url, '_blank');
        } catch (error) {
            console.error('Error sharing task:', error);
        }
    };

    if (!task) return null;

    const progressPercentage = (task.pledgeAmount / task.goalAmount) * 100;
    const daysLeft = getDaysLeft(task.dueDate);

    return (
        <div className="min-vh-100 bg-light">
            <Header first_name="" last_name="" email="" balance={0} projectId="" />
            
            <Container className="py-4">
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
                                    src={task.imageUrl || `/animations/animation-${id}.svg`}
                                    alt={`${task.title} illustration`}
                                    className="w-100 rounded"
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                            </div>

                            <div className="d-flex flex-wrap gap-4 mt-3">
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Calendar size={16} />
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Clock size={16} />
                                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Due today"}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 text-muted">
                                    <Users size={16} />
                                    <span>{task.contributors} contributors</span>
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
                                            ${task.pledgeAmount} of ${task.goalAmount}
                                        </span>
                                    </div>
                                    <ProgressBar 
                                        now={progressPercentage} 
                                        className="mb-3"
                                        style={{ height: '0.75rem' }}
                                    />
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">{task.contributors} contributors</small>
                                        <small className="text-muted">{progressPercentage.toFixed(0)}% of goal</small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        <hr />

                        <div className="mb-4">
                            <h2 className="h4 mb-3">Contributors</h2>
                            {mockContributors.map((contributor) => (
                                <Card key={contributor.id} className="mb-2">
                                    <Card.Body className="d-flex justify-content-between align-items-center py-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div 
                                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                style={{ width: '32px', height: '32px' }}
                                            >
                                                {contributor.initials}
                                            </div>
                                            <span>{contributor.name}</span>
                                        </div>
                                        <span className="fw-bold">${contributor.amount}</span>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>

                        <Row className="g-3">
                            {(task.status === "New" || task.status === "Pledged") ? (
                                <>
                                    <Col sm={6}>
                                        <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                                            <DollarSign size={16} />
                                            Pledge Money
                                        </Button>
                                    </Col>
                                    <Col sm={6}>
                                        <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
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
                                        <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                                            <Share2 size={16} />
                                            Share
                                        </Button>
                                    </Col>
                                </>
                            ) : (
                                <Col xs={12}>
                                    <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
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
        <Badge bg={getVariant()} className="px-3 py-2">
            {status}
        </Badge>
    );
}

function getDaysLeft(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

// Mock data
const mockTasks: Task[] = [
    {
        id: 1,
        title: "Organize Birthday Party",
        description: "Need help planning a surprise birthday party for 20 people. This includes decorations, cake ordering, and coordinating with the venue. The party is for my best friend who is turning 30, and I want to make it special. We already have a venue booked, but need someone to take charge of the overall planning and execution.",
        dueDate: "2023-12-15",
        pledgeAmount: 120,
        goalAmount: 200,
        status: "New",
        contributors: 3,
        category: "Event",
        imageUrl: "/images/birthday-party.jpg",
    },
    // ... other mock tasks
];

const mockContributors: Contributor[] = [
    { id: 1, name: "Alex Johnson", initials: "AJ", amount: 50 },
    { id: 2, name: "Maria Garcia", initials: "MG", amount: 40 },
    { id: 3, name: "Sam Taylor", initials: "ST", amount: 30 },
];

export default TaskDetailPage; 