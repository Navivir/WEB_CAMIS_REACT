package com.example.Joyas.dao;

import com.example.Joyas.model.Camis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CamisRepository extends JpaRepository<Camis, Integer> {
    @Query("SELECT c FROM Camis c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    Page<Camis> searchCamisByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<Camis> findByPublished(Integer published, Pageable pageable);

    Page<Camis> findByDiscountGreaterThan(Integer discount, Pageable pageable);

    Page<Camis> findByUserId(Integer userId, Pageable pageable);

}
