﻿using AutoMapper;
using FoodDeliveryApi.Dto.Order;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.Mapping
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderItemRequestDto, OrderItem>();
            CreateMap<OrderItem, OrderItemResponseDto>();

            CreateMap<OrderItemRequestDto, OrderItem>();
            CreateMap<Order, OrderItemResponseDto>();

            CreateMap<CreateOrderRequestDto, Order>();
            CreateMap<Order, CreateOrderResponseDto>();
        }
    }
}
