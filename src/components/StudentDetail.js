import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Table, Spinner, Form, Button } from "react-bootstrap";

const API_BASE_URL = "https://w7gcjj-3000.csb.app";

function StudentDetail() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [bills, setBills] = useState([]);
  const [services, setServices] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [serviceDateRange, setServiceDateRange] = useState({
    start: "2025-01-01",
    end: "2025-04-18",
  });
  const [guestDateRange, setGuestDateRange] = useState({
    start: "2025-04-01",
    end: "2025-04-18",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      setLoadingStudent(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student/${studentId}`
        );
        setStudent(response.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoadingStudent(false);
      }
    };

    const fetchBills = async () => {
      setLoadingBills(true);
      try {
        const months = [
          "2024-01",
          "2024-02",
          "2024-03",
          "2024-04",
          "2024-05",
          "2024-06",
          "2024-07",
          "2024-08",
          "2024-09",
          "2024-10",
          "2024-11",
          "2024-12",
          "2025-01",
          "2025-02",
          "2025-03",
          "2025-04",
        ];
        const billPromises = months.map((month) =>
          axios.get(`${API_BASE_URL}/bill/${studentId}/${month}`)
        );
        const billResponses = await Promise.all(billPromises);
        setBills(billResponses.map((res) => res.data));
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoadingBills(false);
      }
    };

    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/service-usage/${studentId}/${serviceDateRange.start}/${serviceDateRange.end}`
        );
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoadingServices(false);
      }
    };

    const fetchGuests = async () => {
      setLoadingGuests(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/guest-visits/${studentId}/${guestDateRange.start}/${guestDateRange.end}`
        );
        setGuests(response.data);
      } catch (err) {
        console.error("Error fetching guests:", err);
      } finally {
        setLoadingGuests(false);
      }
    };

    fetchStudent();
    fetchBills();
    fetchServices();
    fetchGuests();
  }, [studentId]);

  const handleServiceDateChange = (e) => {
    setServiceDateRange({
      ...serviceDateRange,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuestDateChange = (e) => {
    setGuestDateRange({ ...guestDateRange, [e.target.name]: e.target.value });
  };

  const handleFetchServices = async () => {
    setLoadingServices(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/service-usage/${studentId}/${serviceDateRange.start}/${serviceDateRange.end}`
      );
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleFetchGuests = async () => {
    setLoadingGuests(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/guest-visits/${studentId}/${guestDateRange.start}/${guestDateRange.end}`
      );
      setGuests(response.data);
    } catch (err) {
      console.error("Error fetching guests:", err);
    } finally {
      setLoadingGuests(false);
    }
  };

  if (loadingStudent || !student) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Button className="my-3" variant="primary" onClick={() => navigate("/")}>
        Back to Homepage
      </Button>

      <h2>Chi tiết sinh viên</h2>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="text-danger">
            {student.name} ({student.studentId})
          </Card.Title>
          <div>
            <strong>Số CMT:</strong> {student.idCard}
          </div>
          <div>
            <strong>Ngày sinh:</strong>{" "}
            {new Date(student.dateOfBirth).toLocaleDateString()}
          </div>
          <div>
            <strong>Lớp:</strong> {student.class}
          </div>
          <div>
            <strong>Quê quán:</strong> {student.hometown}
          </div>
          <div>
            <strong>Phòng:</strong> {student.roomNumber}
          </div>
          <div>
            <strong>Loại phòng:</strong> {student.roomType}
          </div>
        </Card.Body>
      </Card>

      <h3>Hóa đơn hàng tháng</h3>
      {loadingBills ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Tiền phòng</th>
              <th>Tiền dịch vụ</th>
              <th>Gửi xe vé tháng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.month}>
                <td>{bill.month}</td>
                <td>{bill.roomFee.toLocaleString("vi")} VND</td>
                <td>{bill.serviceFee.toLocaleString("vi")} VND</td>
                <td>{bill.vehicleFee.toLocaleString("vi")} VND</td>
                <td>{bill.total.toLocaleString("vi")} VND</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="border border-secondary border-3 rounded p-3 my-4">
        <h3>Dịch vụ sử dụng</h3>
        <Form className="mb-3 d-flex align-items-center">
          <Form.Group className="d-flex align-items-center me-3">
            <Form.Label className="me-2">Từ:</Form.Label>
            <Form.Control
              type="date"
              name="start"
              value={serviceDateRange.start}
              onChange={handleServiceDateChange}
              style={{ width: "150px" }}
            />
          </Form.Group>
          <Form.Group className="d-flex align-items-center me-3">
            <Form.Label className="me-2">Đến:</Form.Label>
            <Form.Control
              type="date"
              name="end"
              value={serviceDateRange.end}
              onChange={handleServiceDateChange}
              style={{ width: "150px" }}
            />
          </Form.Group>
          <Button onClick={handleFetchServices}>Tìm</Button>
        </Form>
        {loadingServices ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading...</p>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Tổng giá</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.serviceName}>
                  <td>{service.serviceName}</td>
                  <td>{service.totalPrice.toLocaleString("vi")} VND</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <div className="border border-secondary border-3 rounded p-3">
        <h3>Khách đến thăm</h3>
        <Form className="mb-3 d-flex align-items-center">
          <Form.Group className="d-flex align-items-center me-3">
            <Form.Label className="me-2">Từ:</Form.Label>
            <Form.Control
              type="date"
              name="start"
              value={guestDateRange.start}
              onChange={handleGuestDateChange}
              style={{ width: "150px" }}
            />
          </Form.Group>
          <Form.Group className="d-flex align-items-center me-3">
            <Form.Label className="me-2">Đến:</Form.Label>
            <Form.Control
              type="date"
              name="end"
              value={guestDateRange.end}
              onChange={handleGuestDateChange}
              style={{ width: "150px" }}
            />
          </Form.Group>
          <Button onClick={handleFetchGuests}>Tìm</Button>
        </Form>
        {loadingGuests ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading...</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center">
            Không có dữ liệu Khách đến thăm trong khoảng thời gian này
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Số CMT</th>
                <th>Tên khách</th>
                <th>Lượt thăm</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.guestIdCard}>
                  <td>{guest.guestIdCard}</td>
                  <td>{guest.guestName}</td>
                  <td>{guest.visitCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
}

export default StudentDetail;
