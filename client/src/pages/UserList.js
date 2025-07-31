import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Form, Card, Badge } from 'react-bootstrap'
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
import CustomButton from '../components/CustomButton.js'

const UserList = observer(() => {
    const [sortField, setSortField] = useState('last_login')
    const [sortOrder, setSortOrder] = useState('asc')

    const [selectedIds, setSelectedIds] = useState([])
    const [isAllSelected, setIsAllSelected] = useState(false)

    const [userList, setUserList] = useState([])
    const { user, error } = useContext(Context)

    const [loadingAction, setLoadingAction] = useState(null)

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
            const allIds = userList.map((user) => user.id)
            setSelectedIds(allIds)
            setIsAllSelected(true)
        }
    }

    useEffect(() => {
        const allIds = userList.map((user) => user.id)
        setIsAllSelected(
            selectedIds.length > 0 && selectedIds.length === allIds.length
        )
    }, [selectedIds, userList])

    const handleBtnUsersList = async (fc, actionName) => {
        if (selectedIds.length === 0) return
        setLoadingAction(actionName)

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
            error.setError(e.response?.data?.message || e.message)
            if ([401, 403].includes(e.response?.status)) logout()
        } finally {
            setLoadingAction(null)
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
                <CustomButton
                    variant="outline-primary"
                    isLoading={loadingAction === 'block'}
                    onClick={() => handleBtnUsersList(blockUser, 'block')}
                    icon={
                        <svg
                            style={{ paddingRight: 2 }}
                            fill="currentColor"
                            width="20px"
                            height="20px"
                            viewBox="-14.25 0 122.88 122.88"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            enable-background="new 0 0 94.38 122.88"
                        >
                            <g>
                                <path d="M8.723,45.706h2.894v-8.729c0-10.139,3.987-19.368,10.412-26.069C28.479,4.177,37.386,0,47.19,0 c9.805,0,18.711,4.177,25.163,10.907c6.424,6.701,10.411,15.931,10.411,26.069v8.729h2.894c2.401,0,4.583,0.98,6.162,2.56 s2.56,3.761,2.56,6.162v59.73c0,2.401-0.98,4.583-2.56,6.162s-3.761,2.56-6.162,2.56H8.723c-2.402,0-4.583-0.98-6.163-2.56 S0,116.56,0,114.158v-59.73c0-2.401,0.981-4.583,2.56-6.162C4.14,46.687,6.321,45.706,8.723,45.706L8.723,45.706z M44,87.301 L39.81,98.28h14.762l-3.884-11.13c2.465-1.27,4.15-3.84,4.15-6.803c0-4.223-3.425-7.647-7.647-7.647 c-4.223,0-7.648,3.425-7.648,7.647C39.542,83.432,41.369,86.091,44,87.301L44,87.301z M17.753,45.706h58.875v-8.729 c0-8.511-3.326-16.236-8.686-21.826C62.61,9.589,55.265,6.137,47.19,6.137S31.77,9.589,26.438,15.15 c-5.359,5.59-8.686,13.315-8.686,21.826V45.706L17.753,45.706z M85.658,51.843H8.723c-0.708,0-1.353,0.292-1.823,0.762 c-0.47,0.47-0.762,1.116-0.762,1.823v59.73c0,0.707,0.292,1.353,0.762,1.822c0.47,0.471,1.116,0.762,1.823,0.762h76.936 c0.708,0,1.354-0.291,1.823-0.762c0.47-0.47,0.762-1.115,0.762-1.822v-59.73c0-0.707-0.292-1.353-0.762-1.823 C87.011,52.135,86.366,51.843,85.658,51.843L85.658,51.843z" />
                            </g>
                        </svg>
                    }
                >
                    Block
                </CustomButton>
                <CustomButton
                    variant="outline-primary"
                    isLoading={loadingAction === 'unblock'}
                    onClick={() => handleBtnUsersList(unblockUser, 'unblock')}
                    icon={
                        <svg
                            fill="currentColor"
                            width="20px"
                            height="20px"
                            viewBox="0 -5.32 122.88 122.88"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            enable-background="new 0 0 122.88 112.234"
                        >
                            <g>
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M40.222,78.594l-3.819,10.008h13.454l-3.541-10.143 c2.247-1.158,3.783-3.5,3.783-6.201c0-3.85-3.121-6.971-6.97-6.971c-3.849,0-6.971,3.121-6.971,6.971 C36.159,75.068,37.824,77.492,40.222,78.594L40.222,78.594z M8.07,41.656h49.502v-7.835c0-9.273,3.647-17.713,9.523-23.843 C72.998,3.822,81.146,0,90.116,0c8.918,0,16.905,3.775,22.742,9.864c5.864,6.117,9.547,14.583,9.789,23.889l0.231,8.911 c0.038,1.605-1.232,2.937-2.837,2.975c-1.604,0.038-2.937-1.233-2.974-2.838l-0.232-8.911c-0.203-7.803-3.276-14.887-8.171-19.992 c-4.771-4.978-11.287-8.063-18.549-8.063c-7.325,0-13.99,3.132-18.827,8.178c-4.863,5.073-7.882,12.084-7.882,19.809v7.835h14.782 c2.222,0,4.24,0.907,5.701,2.368c1.461,1.461,2.368,3.479,2.368,5.702v54.438c0,2.223-0.907,4.24-2.368,5.701 s-3.479,2.369-5.701,2.369H8.07c-2.223,0-4.241-0.908-5.702-2.369C0.907,108.404,0,106.387,0,104.164V49.726 c0-2.222,0.907-4.24,2.369-5.702C3.83,42.563,5.848,41.656,8.07,41.656L8.07,41.656z M78.189,47.491H8.07 c-0.612,0-1.17,0.252-1.576,0.659c-0.407,0.406-0.659,0.965-0.659,1.576v54.438c0,0.611,0.252,1.17,0.659,1.576 c0.406,0.406,0.964,0.658,1.576,0.658h70.119c0.611,0,1.17-0.252,1.576-0.658s0.659-0.965,0.659-1.576V49.726 c0-0.611-0.253-1.17-0.659-1.576C79.359,47.743,78.801,47.491,78.189,47.491L78.189,47.491z"
                                />
                            </g>
                        </svg>
                    }
                ></CustomButton>
                <CustomButton
                    variant="outline-danger"
                    isLoading={loadingAction === 'delete'}
                    onClick={() => handleBtnUsersList(deleteUser, 'delete')}
                    icon={
                        <svg
                            fill="currentColor"
                            width="20px"
                            height="20px"
                            viewBox="-7.29 0 122.88 122.88"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g>
                                <path d="M77.4,49.1h-5.94v56.09h5.94V49.1L77.4,49.1L77.4,49.1z M6.06,9.06h32.16V6.2c0-0.1,0-0.19,0.01-0.29 c0.13-2.85,2.22-5.25,5.01-5.79C43.97-0.02,44.64,0,45.38,0H63.9c0.25,0,0.49-0.01,0.73,0.02c1.58,0.08,3.02,0.76,4.06,1.81 c1.03,1.03,1.69,2.43,1.79,3.98c0.01,0.18,0.02,0.37,0.02,0.55v2.7H103c0.44,0,0.75,0.01,1.19,0.08c2.21,0.36,3.88,2.13,4.07,4.37 c0.02,0.24,0.03,0.47,0.03,0.71v10.54c0,1.47-1.19,2.66-2.67,2.66H2.67C1.19,27.43,0,26.23,0,24.76V24.7v-9.91 C0,10.64,2.04,9.06,6.06,9.06L6.06,9.06z M58.07,49.1h-5.95v56.09h5.95V49.1L58.07,49.1L58.07,49.1z M38.74,49.1H32.8v56.09h5.95 V49.1L38.74,49.1L38.74,49.1z M10.74,31.57h87.09c0.36,0.02,0.66,0.04,1.03,0.1c1.25,0.21,2.4,0.81,3.27,1.66 c1.01,1,1.67,2.34,1.7,3.83c0,0.31-0.03,0.63-0.06,0.95l-7.33,78.66c-0.1,1.03-0.27,1.95-0.79,2.92c-1.01,1.88-2.88,3.19-5.2,3.19 H18.4c-0.55,0-1.05,0-1.59-0.08c-0.22-0.03-0.43-0.08-0.64-0.14c-0.31-0.09-0.62-0.21-0.91-0.35c-0.27-0.13-0.52-0.27-0.78-0.45 c-1.51-1.04-2.51-2.78-2.69-4.72L4.5,37.88c-0.02-0.25-0.04-0.52-0.04-0.77c0.05-1.48,0.7-2.8,1.7-3.79 c0.88-0.86,2.06-1.47,3.33-1.67C9.9,31.59,10.34,31.57,10.74,31.57L10.74,31.57z M97.75,36.9H10.6c-0.57,0-0.84,0.1-0.79,0.7 l7.27,79.05h0l0,0.01c0.03,0.38,0.2,0.69,0.45,0.83l0,0l0.08,0.03l0.06,0.01l0.08,0h72.69c0.6,0,0.67-0.84,0.71-1.28l7.34-78.71 C98.53,37.04,98.23,36.9,97.75,36.9L97.75,36.9z" />
                            </g>
                        </svg>
                    }
                ></CustomButton>
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
                    className={`align-items-center py-2 border-bottom ${
                        user.block_status === 1 &&
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
