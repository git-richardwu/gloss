import { useParams } from "react-router-dom";
import React, {useState} from "react";
import { bookAPI } from "../services/bookAPI"
import type { Book } from '../../types';

const BookPage = () => {
    const { work_id } = useParams<{work_id: string}>();

    return (
        <div>
        </div>
    )
}