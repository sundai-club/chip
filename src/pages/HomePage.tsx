import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { apiClient } from '../shared/services/api';
import Header from '../shared/components/Header';
import { TaskCard } from '../components/task-card';
import { TaskFilter } from '../components/task-filter';
import { Input } from '../components/ui/input';
import { Search, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
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
    };
}

type FilterTab = 'all' | 'contribute' | 'upcoming' | 'mytasks' | 'completed' | 'closed';
type SortOption = 'newest' | 'dueDate' | 'amountHighest' | 'amountLowest';
type TaskCategory = 'Event' | 'Transportation' | 'Food' | 'Shopping' | 'Entertainment' | 'all';

// Mock data
const mockTasks: Task[] = [
    {
        id: 1,
        title: "Organize Birthday Party",
        description: "Need help planning a surprise birthday party for 20 people",
        due_date: "2023-12-15",
        goal: 200,
        status: "New",
        category: "Event",
        image_url: `/animations/animation-1.svg`,
        statistics: {
            total_pledged: 120,
            contributor_count: 3,
            days_remaining: 0
        }
    },
    // ... Add more mock tasks as needed
];

// Add interface for user
interface User {
    first_name: string;
    last_name: string;
    email: string;
    balance: number;
    projectId: string;
}

const HomePage = () => {
    const [user, setUser] = useState<User>({
        first_name: '',
        last_name: '',
        email: '',
        balance: 0,
        projectId: ''
    });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [selectedCategory, setSelectedCategory] = useState<TaskCategory>("all");
    const navigate = useNavigate();

    // Load tasks
    useEffect(() => {
        const loadTasks = async () => {
            console.time('loadTasks');
            try {
                console.log('Fetching tasks with params:', {
                    status: activeTab === 'all' ? undefined : activeTab,
                    category: selectedCategory === 'all' ? undefined : selectedCategory,
                    search: searchQuery,
                    ordering: sortBy === 'newest' ? '-created_at' : 
                            sortBy === 'dueDate' ? 'due_date' :
                            sortBy === 'amountHighest' ? '-goal' : 'goal'
                });
                
                const tasks = await apiClient.get('/api/chip/tasks/', {
                    params: {
                        status: activeTab === 'all' ? undefined : activeTab,
                        category: selectedCategory === 'all' ? undefined : selectedCategory,
                        search: searchQuery,
                        ordering: sortBy === 'newest' ? '-created_at' : 
                                sortBy === 'dueDate' ? 'due_date' :
                                sortBy === 'amountHighest' ? '-goal' : 'goal'
                    }
                });
                console.log('API Response:', tasks);
                console.time('setTasksState');
                setTasks(tasks || []);
                console.timeEnd('setTasksState');
            } catch (error) {
                console.error('Error loading tasks:', error);
                setTasks([]);
            }
            console.timeEnd('loadTasks');
        };

        console.log('Task dependencies changed:', { activeTab, selectedCategory, searchQuery, sortBy });
        loadTasks();
    }, [activeTab, selectedCategory, searchQuery, sortBy]);

    // Memoize the filtered and sorted tasks
    const filteredTasks = React.useMemo(() => {
        console.time('filterAndSortTasks');
        // First filter by tab
        let result = tasks;
        
        console.log('Starting filtration with', tasks.length, 'tasks');
        
        // Apply tab filter
        switch (activeTab) {
            case "contribute":
                result = result.filter((task) => task.status === "New" || task.status === "Pledged");
                break;
            case "upcoming":
                result = result.filter((task) => task.status === "Accepted");
                break;
            case "mytasks":
                result = result.filter((task) => task.statistics.contributor_count > 0);
                break;
            case "completed":
                result = result.filter((task) => task.status === "Completed");
                break;
            case "closed":
                result = result.filter((task) => task.status === "Closed");
                break;
        }
        console.log('After tab filter:', result.length, 'tasks');

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query) ||
                    task.category.toLowerCase().includes(query)
            );
            console.log('After search filter:', result.length, 'tasks');
        }

        // Apply category filter
        if (selectedCategory !== "all") {
            result = result.filter((task) => task.category === selectedCategory);
            console.log('After category filter:', result.length, 'tasks');
        }

        // Apply sorting
        let sortedResult;
        switch (sortBy) {
            case "dueDate":
                sortedResult = [...result].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
                break;
            case "amountHighest":
                sortedResult = [...result].sort((a, b) => b.goal - a.goal);
                break;
            case "amountLowest":
                sortedResult = [...result].sort((a, b) => a.goal - b.goal);
                break;
            case "newest":
            default:
                sortedResult = [...result].sort((a, b) => b.id - a.id);
        }
        console.log('Final filtered and sorted result:', sortedResult.length, 'tasks');
        console.timeEnd('filterAndSortTasks');
        return sortedResult;
    }, [tasks, activeTab, searchQuery, selectedCategory, sortBy]);

    // Update user endpoint
    useEffect(() => {
        const loadUser = async () => {
            console.time('loadUser');
            try {
                const userData = await apiClient.get('/api/users/me/');
                console.log('User data response:', userData);
                setUser(userData || {
                    first_name: '',
                    last_name: '',
                    email: '',
                    balance: 0,
                    projectId: ''
                });
            } catch (error) {
                console.error('Error loading user:', error);
            }
            console.timeEnd('loadUser');
        };
        loadUser();
    }, []);

    // Fix for the linter error - explicitly type the callback
    const handleCategoryChange = (category: TaskCategory) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-vh-100 bg-light">
            <Header {...user} />
            <Container className="py-4">
                <Row className="mb-4">
                    <Col xs={12} md={6}>
                        <div className="d-flex align-items-center gap-3">
                            <h2 className="mb-0">Tasks</h2>
                            <Button 
                                variant="primary"
                                onClick={() => navigate('/tasks/create')}
                                className="d-flex align-items-center gap-2"
                            >
                                <Plus size={16} />
                                Create Task
                            </Button>
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form className="d-flex position-relative">
                            <Form.Control
                                type="search"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Search 
                                className="position-absolute" 
                                style={{ 
                                    left: '10px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    width: '16px',
                                    height: '16px',
                                    color: '#6c757d'
                                }} 
                            />
                        </Form>
                    </Col>
                </Row>

                <TaskFilter
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {filteredTasks.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">No tasks found matching your criteria.</p>
                    </div>
                ) : (
                    <Row>
                        {filteredTasks.map((task) => (
                            <Col key={task.id} xs={12} md={6} lg={4} className="mb-4">
                                <TaskCard task={task} />
                            </Col>
                        ))}
                    </Row>
                )}

                <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/settings')}
                    className="position-fixed"
                    style={{ bottom: '20px', right: '20px' }}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </Container>
        </div>
    );
};

export default HomePage;