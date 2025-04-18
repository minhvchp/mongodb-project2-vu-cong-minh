import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Pagination,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

const API_BASE_URL = "https://w7gcjj-3000.csb.app";

function Home() {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const limit = 10;
  const navigate = useNavigate();

  // Lấy danh sách sinh viên
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/students?page=${currentPage}&limit=${limit}`
        );
        setStudents(response.data.students);
        setTotalStudents(response.data.total);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [currentPage]);

  // Lấy doanh thu dịch vụ
  useEffect(() => {
    const fetchRevenue = async () => {
      setLoadingRevenue(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/service-revenue/2024-01-01/2025-04-18`
        );
        setRevenue(response.data);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      } finally {
        setLoadingRevenue(false);
      }
    };
    fetchRevenue();
  }, []);

  // Xử lý phân trang
  const totalPages = Math.ceil(totalStudents / limit);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  return (
    <Container className="mt-4">
      <Row>
        <div className="col-8">
          <h4 className="text-center">Danh sách sinh viên</h4>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Số CMT</th>
                    <th>Ngày sinh</th>
                    <th>Lớp</th>
                    <th>Quê quán</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.studentId}
                      onClick={() => handleRowClick(student.studentId)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.idCard}</td>
                      <td>
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </td>
                      <td>{student.class}</td>
                      <td>{student.hometown}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="text-danger">* Click vào từng dòng để xem thông tin chi tiết từng sinh viên</p>
              
              <div
                className="d-flex justify-content-center mt-3"
                style={{ overflowX: "auto", maxWidth: "100%" }}
              >
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {currentPage > 3 && (
                    <>
                      <Pagination.Item onClick={() => handlePageChange(1)}>
                        1
                      </Pagination.Item>
                      <Pagination.Ellipsis disabled />
                    </>
                  )}

                  {[...Array(totalPages).keys()]
                    .filter((page) => Math.abs(page + 1 - currentPage) <= 2)
                    .map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      <Pagination.Ellipsis disabled />
                      <Pagination.Item
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Pagination.Item>
                    </>
                  )}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </div>
        <div className="col-4">
          <h4 className="text-center">Doanh thu dịch vụ tháng này</h4>
          {loadingRevenue ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((item) => (
                  <tr key={item.serviceName}>
                    <td>{item.serviceName}</td>
                    <td>{item.totalRevenue.toLocaleString("vi")} VND</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Row>
    </Container>
  );
}

export default Home;
