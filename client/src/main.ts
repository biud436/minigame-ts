import { ErrorBoundary } from "./core/error";
import { App } from "./core/app";

const errorBoundary = new ErrorBoundary(App.getInstance());
