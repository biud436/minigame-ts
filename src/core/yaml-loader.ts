import yaml from "js-yaml";
import axios from "axios";

export default async function loadYaml<T = unknown>(url: string): Promise<T> {
    const response = await axios.get(url);
    return yaml.load(response.data) as T;
}
