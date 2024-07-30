import { useEffect, useState } from "react";
import { useNavigate, useParams } from "../../node_modules/react-router-dom/dist/index";
import axios from "../../node_modules/axios/index";

export default function PlannerDetail() {
  const [planner, setPlanner] = useState({});
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");

  const { plannerIdx } = useParams();

  const navigate = useNavigate();

  const listButtonClick = (e) => {
    e.preventDefault();
    navigate("/planner"); // 또는 navigate('/list') 또는 navigate(-1)
  };
  const updateButtonClick = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:8080/api/planner/${plannerIdx}`, {
        title,
        contents,
      })
      .then((res) => {
        res && res.status === 200 && navigate("/");
      })
      .catch((err) => console.log(err));
  };
  const deleteButtonClick = (e) => {
    e.preventDefault();

    axios
      .delete(`http://localhost:8080/api/planner/${plannerIdx}`)
      .then((res) => {
        res && res.status === 200 && navigate("/");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/planner/${plannerIdx}`)
      .then((res) => {
        res && res.data && setPlanner(res.data);
        setTitle(res.data.title);
        setContents(res.data.contents);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="container">
        <h2>게시판 상세</h2>
        <form id="frm" method="post">
          <input type="hidden" id="plannerIdx" name="plannerIdx" />

          <table className="board_detail">
            <colgroup>
              <col width="15%" />
              <col width="*" />
              <col width="15%" />
              <col width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">글 번호</th>
                <td>{planner.plannerIdx}</td>
                <th scope="row">조회수</th>
                <td>{planner.hitCnt}</td>
              </tr>
              <tr>
                <th scope="row">작성자</th>
                <td>{planner.creatorId}</td>
                <th scope="row">작성일</th>
                <td>{planner.createDatetime}</td>
              </tr>
              <tr>
                <th scope="row">제목</th>
                <td colSpan="3">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="4">
                  <textarea
                    id="contents"
                    name="contents"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <div className="file_list">
          {planner.fileInfoList &&
            planner.fileInfoList.map((fileInfo) => (
              <p>
                {fileInfo.originalFileName} ({fileInfo.fileSize}kb)
              </p>
            ))}
        </div>

        <input
          type="button"
          id="list"
          className="btn"
          value="목록으로"
          onClick={listButtonClick}
        />
        <input
          type="button"
          id="update"
          className="btn"
          value="수정하기"
          onClick={updateButtonClick}
        />
        <input
          type="button"
          id="delete"
          className="btn"
          value="삭제하기"
          onClick={deleteButtonClick}
        />
      </div>
    </>
  );
}
