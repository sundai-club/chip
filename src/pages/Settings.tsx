import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Table,
    Nav,
    Spinner,
    Card,
    Alert,
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';

import './Settings.scss';
import { useAlerts } from '../shared/context/AlertProvider';
import { apiClient } from '../shared/services/api';
import Header from '../shared/components/Header';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    active_subscription: string | null;
}

interface Project {
    id: string;
    name: string;
}

interface AlertContext {
    success: (message: string) => void;
    error: (message: string) => void;
}

interface SettingsNavLinkProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const SettingsNavLink: React.FC<SettingsNavLinkProps> = ({
    active,
    onClick,
    children,
}) => (
    <Nav.Link
        active={active}
        onClick={onClick}
        className={`settings-nav-link ${active ? 'active' : ''}`}
    >
        {children}
    </Nav.Link>
);

const SettingsPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [portalError, setPortalError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedSection = searchParams.get('section') || 'basic';
    const projectId = searchParams.get('project_id');
    const [project, setProject] = useState<Project | null>(null);
    const alerts = useAlerts() as AlertContext;

    const navigateToSection = (section: string) => {
        searchParams.set('section', section);
        setSearchParams(searchParams);
    };

    const updateProject = async () => {
        if (projectId) {
            const projectData = await apiClient.get<Project>(
                `/api/projects/${projectId}/`
            );
            setProject(projectData);
        }
    };

    useEffect(() => {
        if (projectId) {
            updateProject();
        }
    }, [projectId]);

    useEffect(() => {
        setLoading(true);
        apiClient
            .get<User>('/api/users/me/')
            .then(userData => {
                setUser(userData);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!user) return;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await apiClient.patch('/api/users/me/', user);
            alerts.success('Settings updated successfully');
        } catch {
            alerts.error('Failed to update settings');
        }
    };

    const redirectToStripePortal = async () => {
        setPortalLoading(true);
        setPortalError(null);
        try {
            const data = await apiClient.post<{ url: string }>(
                '/api/customer-portal/'
            );
            window.location.href = data.url;
        } catch (error) {
            console.error('Error accessing Stripe portal:', error);
            setPortalError(
                'Failed to access billing portal. Please try again later.'
            );
            setPortalLoading(false);
        }
    };

    const createCheckoutSession = async () => {
        setPortalLoading(true);
        setPortalError(null);
        try {
            const data = await apiClient.post<{ url: string }>(
                '/api/create-checkout-session/',
                {
                    price_id: 'your_stripe_price_id',
                }
            );
            window.location.href = data.url;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            setPortalError(
                'Failed to start subscription process. Please try again later.'
            );
            setPortalLoading(false);
        }
    };

    const renderBasicInfo = () => {
        if (!user) return null;

        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                    />
                </Form.Group>

                <Form.Group controlId="firstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={user.first_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="lastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={user.last_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        );
    };

    const renderPaymentBilling = () => {
        if (!user) return null;

        return (
            <Card>
                <Card.Body>
                    <Card.Title as="h3">Subscription Status</Card.Title>
                    <Alert
                        variant={user.active_subscription ? 'info' : 'warning'}
                        className="mt-3"
                    >
                        <Alert.Heading>
                            {user.active_subscription
                                ? 'Current Plan'
                                : 'No Active Plan'}
                        </Alert.Heading>
                        <p className="mb-0">
                            {user.active_subscription ||
                                'You are not currently subscribed to any plan'}
                        </p>
                    </Alert>

                    {portalError && (
                        <Alert variant="danger" className="mt-3">
                            {portalError}
                        </Alert>
                    )}

                    <div className="d-grid gap-2 mt-4">
                        {user.active_subscription ? (
                            <Button
                                variant="outline-primary"
                                size="lg"
                                onClick={redirectToStripePortal}
                                disabled={portalLoading}
                            >
                                {portalLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Loading...
                                    </>
                                ) : (
                                    'Manage Subscription'
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={createCheckoutSession}
                                disabled={portalLoading}
                            >
                                {portalLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Loading...
                                    </>
                                ) : (
                                    'Subscribe Now'
                                )}
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="Settings">
                <Container className="mt-4 d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }

    return (
        <div className="Settings">
            {user && <Header {...user} projectId={projectId || ''} />}
            <Container className="mt-4 Settings-container">
                <h1 style={{ textAlign: 'center' }}>
                    {selectedSection !== 'project'
                        ? 'Settings'
                        : 'Site Settings'}
                </h1>
                <Row>
                    <Col
                        md={3}
                        style={{
                            borderRight: '1px solid #dee2e6',
                        }}
                    >
                        <Nav className="flex-column">
                            <SettingsNavLink
                                active={selectedSection === 'basic'}
                                onClick={() => navigateToSection('basic')}
                            >
                                Basic Information
                            </SettingsNavLink>
                            <SettingsNavLink
                                active={selectedSection === 'payment'}
                                onClick={() => navigateToSection('payment')}
                            >
                                Payment/Billing
                            </SettingsNavLink>
                            {project && project.name && (
                                <SettingsNavLink
                                    active={selectedSection === 'project'}
                                    onClick={() => navigateToSection('project')}
                                >
                                    Current Project:
                                    <br />
                                    {project.name}
                                </SettingsNavLink>
                            )}
                        </Nav>
                    </Col>
                    <Col md={9}>
                        {selectedSection === 'basic' && renderBasicInfo()}
                        {selectedSection === 'payment' &&
                            renderPaymentBilling()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SettingsPage;
