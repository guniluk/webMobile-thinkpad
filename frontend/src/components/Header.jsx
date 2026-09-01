import { Link, useLocation } from "react-router";
import { PlusCircle, Lightbulb } from "lucide-react";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-200 shadow-sm transition-all">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="navbar min-h-16 px-0 justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl md:text-2xl text-primary tracking-tight transition-transform hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Lightbulb className="w-6 h-6" />
            </div>
            <span>ThinkPad</span>
          </Link>

          <div className="flex items-center gap-2">
            {location.pathname !== "/create" && (
              <Link
                to="/create"
                className="btn btn-primary btn-sm md:btn-md gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">새 Think 작성</span>
                <span className="sm:hidden">작성</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
