package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepo;

@Service
public class TaskService {

    @Autowired
    TaskRepo tr;

    public Task addTask(Task task) {
        return tr.save(task);
    }

    public List<Task> getAllTask() {
        return tr.findAll();
    }

}
