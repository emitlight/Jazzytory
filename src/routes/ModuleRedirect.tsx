import { useParams, Navigate } from 'react-router-dom';
import { lessonPathOfModule } from '../data';

/** 구 /module/:moduleId 링크를 새 차시 경로로 넘긴다 (콘텐츠 데이터의 내부 링크 호환) */
export default function ModuleRedirect() {
  const { moduleId } = useParams();
  const path = moduleId ? lessonPathOfModule(moduleId) : null;
  return <Navigate to={path ?? '/courses'} replace />;
}
