import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap'
import {
    getUserList,
    deleteUser,
    blockUser,
    unblockUser,
} from '../http/userListAPI.js'
import { Context } from '../index.js'
import { observer } from 'mobx-react-lite'
import useLogout from '../utils/logout.js'
import formatDate from '../utils/formatDate.js'

const UserList = observer(() => {
    const [sortField, setSortField] = useState('last_login')
    const [sortOrder, setSortOrder] = useState('asc')

    const [selectedIds, setSelectedIds] = useState([])
    const [isAllSelected, setIsAllSelected] = useState(false)

    const [userList, setUserList] = useState([])
    const { user, error } = useContext(Context)

    const logout = useLogout()

    const handleCheckboxChange = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([])
            setIsAllSelected(false)
        } else {
            const allIds = userList.map(user => user.id)
            setSelectedIds(allIds)
            setIsAllSelected(true)
        }
    }

    useEffect(() => {
        const allIds = userList.map(user => user.id)
        setIsAllSelected(
            selectedIds.length > 0 && selectedIds.length === allIds.length
        )
    }, [selectedIds, userList])

    const handleBtnUsersList = async (fc) => {
        console.log("user = ", user.user)
        if (selectedIds.length === 0) return
        try {
            const response = await fc(selectedIds.join('&id='))
            if (response.status === 200) {
                const { users } = await getUserList()
                setUserList(users)

                setSelectedIds([])
                if (users.length < 1) logout()
            }
        } catch (e) {
            error.setShowError(true)

            if (e.response?.data.message) {
                error.setError(e.response.data.message)
            } else {
                error.setError(e.message)
            }
            if (e.response?.status === 403 || e.response?.status === 401) logout()
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const { users } = await getUserList()
            if (users.length < 1) logout()
            setUserList(users)
        }
        fetchUsers()
    }, [])

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const getSortedUsers = () => {
        const sorted = [...userList].sort((a, b) => {
            if (!sortField) return 0
            const aVal =
                sortField === 'last_login'
                    ? new Date(a.last_login)
                    : a[sortField]
            const bVal =
                sortField === 'last_login'
                    ? new Date(b.last_login)
                    : b[sortField]

            if (sortField === 'last_login') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
            }

            return sortOrder === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        })
        return sorted
    }

    return (
        <Container>
            {user.user && (
                <Card className="mb-5 shadow-sm">
                    <Card.Body>
                        <Card.Title>👤 Активный пользователь</Card.Title>
                        <Card.Text>
                            <strong>Имя:</strong> {user.user.name} <br />
                            <strong>Email:</strong> {user.user.email} <br />
                            <strong>Статус:</strong>{' '}
                            <Badge
                                bg={
                                    user.user.block_status === 1
                                        ? 'danger'
                                        : 'success'
                                }
                            >
                                {user.user.block_status === 1
                                    ? 'Заблокирован'
                                    : 'Активен'}
                            </Badge>{' '}
                            <br />
                            <strong>Последний вход:</strong>{' '}
                            {formatDate(user.user.last_login)}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <div className="my-3 d-flex gap-2">
                <Button variant="danger" onClick={() => handleBtnUsersList(blockUser)}>
                    block
                </Button>
                <Button variant="success" onClick={() => handleBtnUsersList(unblockUser)}>
                    Unblock
                </Button>
                <Button variant="dark" onClick={() => handleBtnUsersList(deleteUser)}>
                    Delete
                </Button>
            </div>
            <Row className="fw-bold text-uppercase py-2 border-bottom bg-light">
                <Col xs={1}>
                    <Form.Check
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                    />
                </Col>
                <Col
                    xs={4}
                    onClick={() => handleSort('name')}
                    style={{ cursor: 'pointer' }}
                >
                    Name{' '}
                    {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Col>
                <Col
                    xs={4}
                    onClick={() => handleSort('email')}
                    style={{ cursor: 'pointer' }}
                >
                    Email{' '}
                    {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Col>
                <Col
                    xs={3}
                    onClick={() => handleSort('last_login')}
                    style={{ cursor: 'pointer' }}
                >
                    Last Seen{' '}
                    {sortField === 'last_login' &&
                        (sortOrder === 'asc' ? '↑' : '↓')}
                </Col>
            </Row>
            {getSortedUsers().map((user) => (
                <Row
                    key={user.id}
                    className={`align-items-center py-2 border-bottom ${user.block_status === 1 &&
                        'text-decoration-line-through text-secondary'
                        }`}
                >
                    <Col xs={1}>
                        <Form.Check
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleCheckboxChange(user.id)}
                        />
                    </Col>
                    <Col xs={4}>{user.name}</Col>
                    <Col xs={4}>{user.email}</Col>
                    <Col xs={3}>{formatDate(user.last_login)}</Col>
                </Row>
            ))}
        </Container>
    )
})

export default UserList
