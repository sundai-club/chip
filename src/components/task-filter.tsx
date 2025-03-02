"use client"

import React from 'react';
import { Nav, Form, Row, Col } from 'react-bootstrap';
import type { FilterTab, SortOption, TaskCategory } from '../lib/types';

interface TaskFilterProps {
    activeTab: FilterTab;
    onTabChange: (tab: FilterTab) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    selectedCategory: TaskCategory | "all";
    onCategoryChange: (category: TaskCategory | "all") => void;
}

export const TaskFilter = ({
    activeTab,
    onTabChange,
    sortBy,
    onSortChange,
    selectedCategory,
    onCategoryChange
}: TaskFilterProps) => {
    return (
        <div className="mb-4">
            <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'all'}
                        onClick={() => onTabChange('all')}
                    >
                        All
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'contribute'}
                        onClick={() => onTabChange('contribute')}
                    >
                        Contribute
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'upcoming'}
                        onClick={() => onTabChange('upcoming')}
                    >
                        Accepted/Upcoming
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'mytasks'}
                        onClick={() => onTabChange('mytasks')}
                    >
                        My Tasks
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'completed'}
                        onClick={() => onTabChange('completed')}
                    >
                        Completed
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link 
                        active={activeTab === 'closed'}
                        onClick={() => onTabChange('closed')}
                    >
                        Closed
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            
            <Row>
                <Col xs={12} md={6}>
                    <Form.Select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="mb-2 mb-md-0"
                    >
                        <option value="newest">Newest First</option>
                        <option value="dueDate">Due Date</option>
                        <option value="amountHighest">Amount (Highest)</option>
                        <option value="amountLowest">Amount (Lowest)</option>
                    </Form.Select>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value as TaskCategory | "all")}
                    >
                        <option value="all">All Categories</option>
                        <option value="Event">Event</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Food">Food</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                </Col>
            </Row>
        </div>
    );
};

interface FilterTabProps {
  id: string
  label: string
  active: boolean
  onClick: () => void
}

function FilterTab({ id, label, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
        active
          ? "bg-[#3D1766] text-white"
          : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-gray-900 border"
      }`}
    >
      {label}
    </button>
  )
}

